import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';

import {AuthByApple} from '../../../features/authByApple';
import {AuthByEmail} from '../../../features/authByEmail';
import {AuthByGoogle} from '../../../features/authByGmail';

export const AuthPage = memo(() => {
  const [isSignIn, setISignIn] = useState(true);

  const toggleSignIn = useCallback(() => {
    setISignIn(true);
  }, []);

  const toggleSignUp = useCallback(() => {
    setISignIn(false);
  }, []);

  return (
    <View style={styles.AuthPage}>
      <View style={styles.logoWrapper}>
        <Text style={styles.logo}>LOGO</Text>
      </View>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{isSignIn ? 'Sign in' : 'Sign up'}</Text>
      </View>
      <AuthByGoogle style={styles.authByGoogleBtn} />
      <AuthByApple />
      <AuthByEmail isSingIn={isSignIn} />
      <Pressable
        style={styles.toggleAuthMethod}
        onPress={isSignIn ? toggleSignUp : toggleSignIn}>
        {isSignIn ? (
          <Text>Dont Have an acount ?</Text>
        ) : (
          <Text>Already have an account?</Text>
        )}
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  AuthPage: {
    padding: 15,
  },
  logoWrapper: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    justifyContent: 'center',
    fontSize: 24,
    lineHeight: 30,
  },
  titleWrapper: {},
  title: {
    fontSize: 22,
    lineHeight: 28,
  },
  authByGoogleBtn: {
    marginTop: 10,
    marginBottom: 10,
  },
  toggleAuthMethod: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
