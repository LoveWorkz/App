import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import CheckBox from '@react-native-community/checkbox';
import {useTranslation} from 'react-i18next';

import {Input} from '@src/shared/ui/Input/Input';
import signUpStore from '../model/store/SignUpStore';

const SignUp = () => {
  const {t} = useTranslation();

  useEffect(() => {
    return () => signUpStore.resetForm();
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
    <View>
      <View style={styles.email}>
        <Text style={styles.emailText}>{t('auth.email')}</Text>
        <Input
          value={signUpStore.signUpData.email}
          onChange={onEmailChangeHandler}
          placeholder={t('auth.enter_email') || ''}
        />
        {signUpStore.errorInfo.emailError && (
          <Text style={styles.errorText}>
            {signUpStore.errorInfo.emailError}{' '}
          </Text>
        )}
      </View>
      <View style={styles.password}>
        <Text style={styles.emailText}>{t('auth.password')}</Text>
        <Input
          value={signUpStore.signUpData.password}
          onChange={onPasswordChangeHandler}
          placeholder={'Enter Password'}
        />
        {signUpStore.errorInfo.passwordError && (
          <Text style={styles.errorText}>
            {signUpStore.errorInfo.passwordError}{' '}
          </Text>
        )}
      </View>
      <View>
        <Text style={styles.passwordText}>{t('auth.repeat_password')}</Text>
        <Input
          value={signUpStore.signUpData.confirmPassword}
          onChange={onConfirmPasswordChangeHandler}
          placeholder={t('auth.enter_password') || ''}
        />
        {signUpStore.errorInfo.confirmPasswordError && (
          <Text style={styles.errorText}>
            {signUpStore.errorInfo.confirmPasswordError}
          </Text>
        )}
      </View>
      <CheckBox
        value={signUpStore.agreeWithPrivacyPolicy}
        onValueChange={onCheckboxChangeHandler}
        style={styles.checkbox}
      />
    </View>
  );
};

export const ComponentWrapper = memo(observer(SignUp));

const styles = StyleSheet.create({
  emailText: {
    fontWeight: '600',
  },
  passwordText: {
    fontWeight: '600',
  },
  password: {
    marginBottom: 15,
    marginTop: 15,
  },
  email: {},
  errorText: {
    color: 'red',
    position: 'absolute',
    bottom: -18,
  },
  checkbox: {
    marginTop: 20,
  },
});
