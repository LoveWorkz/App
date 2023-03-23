import React, {memo, useCallback, useEffect} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Input} from '@src/shared/ui/Input/Input';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
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

  const onClickHandler = useCallback(() => {
    navigation.navigate(AppRouteNames.RESET_PASSWORD);
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
          <AppText
            size={TextSize.LEVEL_3}
            weight={'600'}
            text={t('auth.forgot_password')}
          />
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
