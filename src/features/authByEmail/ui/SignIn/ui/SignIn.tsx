import React, {memo, useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';

import {Input} from '@src/shared/ui/Input/Input';
import signInStore from '../model/store/SignInStore';
import {navigate} from '@src/shared/config/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

const SignIn = () => {
  const {t} = useTranslation();

  useFocusEffect(
    React.useCallback(() => {
      return () => signInStore.resetForm();
    }, []),
  );

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
        <Input
          label={t('auth.email') || ''}
          value={signInStore.signInData.email}
          onChange={onEmailChangeHandler}
          placeholder={t('auth.enter_email') || ''}
          error={signInStore.errorInfo.emailError}
        />
      </View>
      <View style={styles.password}>
        <Pressable style={styles.forgotPassword} onPress={onClickHandler}>
          <Text>{t('auth.forgot_password')}</Text>
        </Pressable>
        <Input
          secureTextEntry
          value={signInStore.signInData.password}
          onChange={onPasswordChangeHandler}
          placeholder={t('auth.enter_password') || ''}
          label={t('auth.password') || ''}
          error={signInStore.errorInfo.passwordError}
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
    marginBottom: 15,
    marginTop: 15,
  },
  forgotPassword: {
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
});
