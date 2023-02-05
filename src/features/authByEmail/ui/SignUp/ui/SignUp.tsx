import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
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
      <View>
        <Input
          label={t('auth.email') || ''}
          value={signUpStore.signUpData.email}
          onChange={onEmailChangeHandler}
          placeholder={t('auth.enter_email') || ''}
          error={signUpStore.errorInfo.emailError}
        />
      </View>
      <View style={styles.password}>
        <Input
          label={t('auth.password') || ''}
          value={signUpStore.signUpData.password}
          onChange={onPasswordChangeHandler}
          placeholder={'Enter Password'}
          error={signUpStore.errorInfo.passwordError}
        />
      </View>
      <View>
        <Input
          label={t('auth.repeat_password') || ''}
          value={signUpStore.signUpData.confirmPassword}
          onChange={onConfirmPasswordChangeHandler}
          placeholder={t('auth.enter_password') || ''}
          error={signUpStore.errorInfo.confirmPasswordError}
        />
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
  passwordText: {
    fontWeight: '600',
  },
  password: {
    marginBottom: 15,
    marginTop: 15,
  },
  checkbox: {
    marginTop: 20,
  },
});
