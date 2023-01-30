import React, {memo, useCallback, useEffect} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {observer} from 'mobx-react-lite';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {AuthMethod, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {navigate} from '@src/shared/config/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {
  AUTH_METHOD_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from '@src/shared/consts/storage';
import {Collections} from '@src/shared/types/types';
import {profileStore} from '@src/entities/Profile';

const HomePage = () => {
  useEffect(() => {
    profileStore.fetchProfile();
  }, []);

  const signOut = async () => {
    const authMethod = await authStorage.getAuthData(AUTH_METHOD_STORAGE_KEY);

    try {
      await firestore()
        .collection(Collections.USERS)
        .doc(userStore.authUser?.id)
        .update({
          isAuth: false,
        });
      await authStorage.removeAuthData(AUTH_USER_STORAGE_KEY);

      if (authMethod === AuthMethod.AUTH_BY_GOOGLE) {
        await GoogleSignin.signOut();
      }
      await auth().signOut();
      navigate(AppRouteNames.AUTH);
      userStore.setAuthUser(null);
    } catch (e) {
      console.error(e);
    }
  };

  const verifyEmailHandler = useCallback(async () => {
    try {
      await auth().currentUser?.sendEmailVerification();
      await auth().currentUser?.reload();
    } catch (e) {
      // too many request error
      console.log(e);
    }
  }, []);

  if (!profileStore.profileData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const image = {uri: profileStore.profileData.photo as string};

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.username}>{profileStore.profileData.name}</Text>
      </View>
      <ImageBackground source={image} resizeMode="cover" style={styles.image} />
      <Button theme={ButtonTheme.OUTLINED} onPress={signOut}>
        <Text>sing out</Text>
      </Button>

      {!profileStore.profileData.emailVerified && (
        <Button
          style={styles.confirmEmail}
          theme={ButtonTheme.OUTLINED}
          onPress={verifyEmailHandler}>
          <Text>Confirm email</Text>
        </Button>
      )}
    </View>
  );
};

export const ComponentWrapper = memo(observer(HomePage));

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  test: {
    color: 'red',
  },
  username: {
    fontSize: 20,
    marginBottom: 20,
  },
  image: {
    height: 100,
    width: 100,
    borderColor: 'black',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 20,
  },
  confirmEmail: {
    marginTop: 10,
  },
});
