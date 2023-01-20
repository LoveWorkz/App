import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {SignIn} from './SignIn/ui/SignIn';
import {SignUp} from './SignUp/ui/SignUp';

interface AuthByEmailProps {
  isSingIn: boolean;
}

export const AuthByEmail = memo((props: AuthByEmailProps) => {
  const {isSingIn} = props;

  return (
    <View style={styles.authByEmail}>{isSingIn ? <SignIn /> : <SignUp />}</View>
  );
});

const styles = StyleSheet.create({
  authByEmail: {},
});
