import React, {memo, useCallback, useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {ButtonTheme, Button} from '@src/shared/ui/Button/Button';
import {Input} from '@src/shared/ui/Input/Input';
import signInStore from '../model/store/SignInStore';
import {navigate} from '@src/shared/config/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/configRoute';

const SignIn = () => {
  useEffect(() => {
    return () => signInStore.resetForm();
  }, []);

  const singIn = useCallback(() => {
    signInStore.singIn();
  }, []);

  const onEmailChangeHandler = useCallback((email: string) => {
    signInStore.setEmail(email);
  }, []);

  const onPasswordChangeHandler = useCallback((password: string) => {
    signInStore.setPassword(password);
  }, []);

  const onClickHandler = useCallback(() => {
    navigate(AppRouteNames.RESET_PASSWORD);
  }, []);

  return (
    <View style={styles.SignIn}>
      <View style={styles.email}>
        <Text style={styles.emailText}>Email</Text>
        <Input
          value={signInStore.signInData.email}
          onChange={onEmailChangeHandler}
          placeholder={'Enter Email'}
        />
        {signInStore.errorInfo.emailError && (
          <Text style={styles.errorText}>
            {signInStore.errorInfo.emailError}
          </Text>
        )}
      </View>
      <View style={styles.password}>
        <View style={styles.passwordTitle}>
          <Text style={styles.passwordText}>Password</Text>
          <Pressable onPress={onClickHandler}>
            <Text>Forgot password ?</Text>
          </Pressable>
        </View>
        <Input
          value={signInStore.signInData.password}
          onChange={onPasswordChangeHandler}
          placeholder={'Enter Password'}
        />
        {signInStore.errorInfo.passwordError && (
          <Text style={styles.errorText}>
            {signInStore.errorInfo.passwordError}
          </Text>
        )}
      </View>
      <Button
        onPress={singIn}
        style={styles.singInBtn}
        theme={ButtonTheme.OUTLINED}>
        <Text style={styles.singInBtnText}>Sing in</Text>
      </Button>
    </View>
  );
};

export const ComponentWrapper = memo(observer(SignIn));

const styles = StyleSheet.create({
  SignIn: {
    marginTop: 20,
    height: 350,
  },
  emailText: {
    fontWeight: '600',
  },
  passwordText: {
    fontWeight: '600',
  },
  email: {},
  password: {
    marginBottom: 10,
    marginTop: 10,
  },
  singInBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'black',
  },
  singInBtnText: {
    color: 'white',
  },
  errorText: {
    color: 'red',
  },
  passwordTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
