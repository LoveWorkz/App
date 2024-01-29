import { makeAutoObservable } from 'mobx';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

import { isPlatformIos } from '@src/shared/consts/common';
import { errorHandler } from '@src/shared/lib/errorHandler/errorHandler';

class PushNotificationsStore {
    constructor() {
        makeAutoObservable(this);
    }

    init = async () => {
        try {
            const hasPermission = await this.requestUserPermission();

            if (hasPermission) {
                const token = await this.getToken();
                console.log('token', token)
                await messaging().subscribeToTopic('allUsers');
            }

        } catch (e) {
            errorHandler({ error: e });
        }
    };

    onMessageHandler = (notification: { title: string, body: string }) => {
        Toast.show({
            type: 'info',
            text1: notification.title,
            text2: notification.body
        });
    }

    requestUserPermission = async () => {
        try {
            if (isPlatformIos) {
                const result = this.requestUserIosPermission();
                return result;
            }

            const result = await this.requestUserAndroidPermission();
            return result;
        } catch (e) {
            errorHandler({ error: e });
            return false;
        }
    };

    requestUserAndroidPermission = async () => {
        if (Platform.Version >= 33) {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );

            if (result === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };

    requestUserIosPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        return enabled;
    }

    getToken = async () => {
        const fcmToken = await messaging().getToken();
        return fcmToken;
    };
}

export default new PushNotificationsStore();
