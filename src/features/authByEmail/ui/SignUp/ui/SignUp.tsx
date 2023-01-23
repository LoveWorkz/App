import React, {memo, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import CheckBox from '@react-native-community/checkbox';

import {ButtonTheme, Button} from '@src/shared/ui/Button/Button';
import {Input} from '@src/shared/ui/Input/Input';
import signUpStore from '../model/store/SignUpStore';

const SignUp = () => {
  const register = useCallback(() => {
    signUpStore.register();
  }, []);

  const onEmailChangeHandler = useCallback((email: string) => {
    signUpStore.setEmail(email);
  }, []);

  const onPasswordChangeHandler = useCallback((password: string) => {
    signUpStore.setPassword(password);
  }, []);

  const onConfirmPasswordChangeHandler = useCallback((password: string) => {
    signUpStore.setConfirmPassword(password);
  }, []);

  const onCheckboxChangeHandler = useCallback((isAgree: boolean) => {
    signUpStore.setAgreeWithPrivacyPolicy(isAgree);
  }, []);

  return (
    <View style={styles.SignUP}>
      <View style={styles.email}>
        <Text style={styles.emailText}>Email</Text>
        <Input
          value={signUpStore.signUpData.email}
          onChange={onEmailChangeHandler}
          placeholder={'Enter Email'}
        />
      </View>
      <View style={styles.password}>
        <Text style={styles.emailText}>Password</Text>
        <Input
          value={signUpStore.signUpData.password}
          onChange={onPasswordChangeHandler}
          placeholder={'Enter Password'}
        />
      </View>
      <View>
        <Text style={styles.passwordText}>Repeat Password</Text>
        <Input
          value={signUpStore.signUpData.confirmPassword}
          onChange={onConfirmPasswordChangeHandler}
          placeholder={'Repeat Password'}
        />
        {signUpStore.errorInfo.confirmPasswordError && (
          <Text style={styles.confirmPasswordError}>
            {signUpStore.errorInfo.confirmPasswordError}
          </Text>
        )}
      </View>
      <CheckBox
        value={signUpStore.agreeWithPrivacyPolicy}
        onValueChange={onCheckboxChangeHandler}
        style={styles.checkbox}
      />
      <Button
        disabled={!signUpStore.agreeWithPrivacyPolicy}
        onPress={register}
        style={styles.singInBtn}
        theme={ButtonTheme.OUTLINED}>
        <Text style={styles.singInBtnText}>Sing up</Text>
      </Button>
    </View>
  );
};

export default memo(observer(SignUp));

const styles = StyleSheet.create({
  SignUP: {
    marginTop: 20,
    height: 350,
  },
  emailText: {
    fontWeight: '600',
  },
  passwordText: {
    fontWeight: '600',
  },
  password: {
    marginBottom: 10,
    marginTop: 10,
  },
  email: {},
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
  confirmPasswordError: {
    color: 'red',
  },
  checkbox: {
    marginTop: 20,
  },
});
