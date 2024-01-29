import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging'

import '@src/shared/config/i18next/i18next';
import App from './src/app/App';
import { name as appName } from './app.json';

// Register background handler for Push notifications
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
