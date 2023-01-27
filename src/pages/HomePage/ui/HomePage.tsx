import React, {memo, useCallback} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {observer} from 'mobx-react-lite';
import auth from '@react-native-firebase/auth';

import {AuthMethod, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {navigate} from '@src/shared/config/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {AUTH_METHOD_STORAGE_KEY} from '@src/shared/consts/storage';

const HomePage = () => {
  const signOut = async () => {
    const authMethod = await authStorage.getAuthData(AUTH_METHOD_STORAGE_KEY);

    if (authMethod === AuthMethod.AUTH_BY_GOOGLE) {
      try {
        await auth().signOut();
        await GoogleSignin.signOut();
        navigate(AppRouteNames.AUTH);
        userStore.setAuthUser(null);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await auth().signOut();
        navigate(AppRouteNames.AUTH);
        userStore.setAuthUser(null);
      } catch (error) {
        console.error(error);
      }
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

  const image = {uri: userStore.authUser?.photo as string};

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.username}>{userStore.authUser?.name}</Text>
      </View>
      <ImageBackground source={image} resizeMode="cover" style={styles.image} />
      <Button theme={ButtonTheme.OUTLINED} onPress={signOut}>
        <Text>sing out</Text>
      </Button>

      {!userStore.authUser?.emailVerified && (
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
