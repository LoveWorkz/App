import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {user} from '../../../entities/User';
import {ButtonTheme, Button} from '../../../shared/ui/Button/Button';
import {navigationRef} from '../../../shared/config/navigation/navigation';
import {AppRouteNames} from '../../../shared/config/configRoute';

interface AuthByGoogleProps {
  style: Record<string, string | number>;
}

export const AuthByGoogle = memo((props: AuthByGoogleProps) => {
  const {style} = props;

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userData = await GoogleSignin.signIn();

      user.setAuthUser(userData);
      navigationRef.navigate(AppRouteNames.MAIN);

      const googleCredential = auth.GoogleAuthProvider.credential(
        userData.idToken,
      );

      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log(error, 'error');
      // if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      //   // user cancelled the login flow
      // } else if (error.code === statusCodes.IN_PROGRESS) {
      //   // operation (e.g. sign in) is in progress already
      // } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      //   // play services not available or outdated
      // } else {
      //   // some other error happened
      // }
    }
  };

  return (
    <View style={[style, styles.authByGoogle]}>
      <Button onPress={signIn} theme={ButtonTheme.OUTLINED}>
        <Text>Continue with Google</Text>
      </Button>
    </View>
  );
});

const styles = StyleSheet.create({
  authByGoogle: {},
});
