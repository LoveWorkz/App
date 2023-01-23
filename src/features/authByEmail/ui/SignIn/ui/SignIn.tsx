import React, {memo, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {ButtonTheme, Button} from '@src/shared/ui/Button/Button';
import {Input} from '@src/shared/ui/Input/Input';
import signInStore from '../model/store/SignInStore';

const SignIn = () => {
  const singIn = useCallback(() => {
    signInStore.singIn();
  }, []);

  const onEmailChangeHandler = useCallback((email: string) => {
    signInStore.setEmail(email);
  }, []);

  const onPasswordChangeHandler = useCallback((password: string) => {
    signInStore.setPassword(password);
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
      </View>
      <View style={styles.password}>
        <Text style={styles.passwordText}>Password</Text>
        <Input
          value={signInStore.signInData.password}
          onChange={onPasswordChangeHandler}
          placeholder={'Enter Password'}
        />
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

export default memo(observer(SignIn));

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
});
