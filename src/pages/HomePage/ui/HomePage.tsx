import React, {memo} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {observer} from 'mobx-react-lite';
import auth from '@react-native-firebase/auth';

import {AuthMethod, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/configRoute';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {navigate} from '@src/shared/config/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {AUTH_METHOD_STORAGE_KEY} from '@src/shared/consts/storage';

export const HomePage = memo(
  observer(() => {
    const signOut = async () => {
      const authMethod = await authStorage.getAuthData(AUTH_METHOD_STORAGE_KEY);

      if (authMethod === AuthMethod.AUTH_BY_GOOGLE) {
        try {
          await GoogleSignin.signOut();
          await auth().signOut();
          userStore.setAuthUser(null);
          navigate(AppRouteNames.AUTH);
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          await auth().signOut();
          userStore.setAuthUser(null);
          navigate(AppRouteNames.AUTH);
        } catch (error) {
          console.error(error);
        }
      }
    };

    const image = {uri: userStore.authUser?.photo as string};

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.username}>{userStore.authUser?.name}</Text>
        </View>
        <ImageBackground
          source={image}
          resizeMode="cover"
          style={styles.image}
        />
        <Button theme={ButtonTheme.OUTLINED} onPress={signOut}>
          <Text>sing out</Text>
        </Button>
      </View>
    );
  }),
);

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
});
