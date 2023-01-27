import React, {memo, useCallback, useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Input} from '@src/shared/ui/Input/Input';
import signInStore from '../model/store/SignInStore';
import {navigate} from '@src/shared/config/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

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

  const onClickHandler = useCallback(() => {
    navigate(AppRouteNames.RESET_PASSWORD);
  }, []);

  return (
    <View>
      <View style={styles.email}>
        <Text style={styles.emailText}>{t('auth.email')}</Text>
        <Input
          value={signInStore.signInData.email}
          onChange={onEmailChangeHandler}
          placeholder={t('auth.enter_email') || ''}
        />
        {signInStore.errorInfo.emailError && (
          <Text style={styles.errorText}>
            {signInStore.errorInfo.emailError}
          </Text>
        )}
      </View>
      <View style={styles.password}>
        <View style={styles.passwordTitle}>
          <Text style={styles.passwordText}>{t('auth.password')}</Text>
          <Pressable onPress={onClickHandler}>
            <Text>{t('auth.forgot_password')}</Text>
          </Pressable>
        </View>
        <Input
          value={signInStore.signInData.password}
          onChange={onPasswordChangeHandler}
          placeholder={t('auth.enter_password') || ''}
        />
        {signInStore.errorInfo.passwordError && (
          <Text style={styles.errorText}>
            {signInStore.errorInfo.passwordError}
          </Text>
        )}
      </View>
    </View>
  );
};

export const ComponentWrapper = memo(observer(SignIn));

const styles = StyleSheet.create({
  email: {
    position: 'relative',
  },
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
  errorText: {
    color: 'red',
    position: 'absolute',
    bottom: -18,
  },
  passwordTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
