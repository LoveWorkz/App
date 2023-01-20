import React, {memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {observer} from 'mobx-react-lite';

import {user} from '../../../entities/User';
import {AppRouteNames} from '../../../shared/config/configRoute';
import {navigationRef} from '../../../shared/config/navigation/navigation';
import {Button, ButtonTheme} from '../../../shared/ui/Button/Button';

export const HomePage = memo(
  observer(() => {
    const signOut = async () => {
      try {
        console.log('sing out work');
        await GoogleSignin.signOut();
        user.setAuthUser(null);
        navigationRef.navigate(AppRouteNames.AUTH);
      } catch (error) {
        console.error(error);
      }
    };

    if (!user?.authUser) {
      return <ActivityIndicator size="large" />;
    }

    const image = {uri: user.authUser?.user?.photo};

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.username}>{user.authUser.user.name}</Text>
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
