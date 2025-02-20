import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Input} from '@src/shared/ui/Input/Input';
import {globalStyles} from '@src/app/styles/GlobalStyle';
import {ResetPassword} from '@src/features/ResetPassword';
import {verticalScale} from '@src/shared/lib/Metrics';
import signInStore from '../model/store/SignInStore';

const SignIn = () => {
  const {t} = useTranslation();

  useEffect(() => {
    return () => signInStore.resetForm();
  }, []);

  const onEmailChangeHandler = useCallback((email: string) => {
    signInStore.setEmail(email);
  }, []);

  const onPasswordChangeHandler = useCallback((password: string) => {
    signInStore.setPassword(password);
  }, []);

  return (
    <View>
      <View style={styles.email}>
        <Input
          label={t('auth.email')}
          value={signInStore.signInData.email}
          onChange={onEmailChangeHandler}
          placeholder={t('auth.enter_email')}
          error={t(signInStore.errorInfo.emailError)}
        />
      </View>
      <View style={styles.password}>
        <View style={styles.forgotPasswordWrapper}>
          <ResetPassword />
        </View>
        <Input
          secureTextEntry
          value={signInStore.signInData.password}
          onChange={onPasswordChangeHandler}
          placeholder={t('auth.enter_password') || ''}
          label={t('auth.password') || ''}
          error={t(signInStore.errorInfo.passwordError)}
        />
      </View>
    </View>
  );
};

export const ComponentWrapper = memo(observer(SignIn));

const styles = StyleSheet.create({
  email: {
    position: 'relative',
  },
  passwordText: {
    fontWeight: '600',
  },
  password: {
    marginVertical: verticalScale(15),
  },
  forgotPasswordWrapper: {
    position: 'absolute',
    top: verticalScale(-17),
    right: 0,
    ...globalStyles.forgotPasswordZIndex,
  },
});
