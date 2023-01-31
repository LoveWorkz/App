import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
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
import {ComponentWrapper as Header} from './Header/Header';
import {HomeCategory} from '@src/widgets/HomeCategory';
import {Loader, LoaderSize} from '@src/shared/ui/Loader/Loader';

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
        <Loader size={LoaderSize.LARGE} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        name={profileStore.profileData.name || ''}
        imageUrl={profileStore.profileData.photo || ''}
      />
      <View style={styles.homeCategoryWrapper}>
        <HomeCategory />
      </View>
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
    flex: 1,
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
  confirmEmail: {
    marginTop: 10,
  },
  homeCategoryWrapper: {
    width: '100%',
  },
});
