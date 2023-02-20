import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Input} from '@src/shared/ui/Input/Input';
import resetPasswordStore from '../model/store/ResetPasswordStore';

const ResetPasswordPage = () => {
  const {t} = useTranslation();

  useEffect(() => {
    return () => resetPasswordStore.resetForm();
  }, []);

  const onChangeHandler = useCallback((text: string) => {
    resetPasswordStore.setEmail(text);
  }, []);

  const onClickHandler = useCallback(() => {
    resetPasswordStore.sendPasswordResetEmail();
  }, []);

  return (
    <View style={styles.ResetPassword}>
      <Text style={styles.title}>Reset Password</Text>
      <View style={styles.inputWrapper}>
        <Input
          placeholder={t('auth.enter_email') || ''}
          value={resetPasswordStore.email}
          onChange={onChangeHandler}
          error={resetPasswordStore.emailError}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <Button onPress={onClickHandler} theme={ButtonTheme.OUTLINED}>
          <Text>reset password</Text>
        </Button>
      </View>
    </View>
  );
};

export const ComponentWrapper = memo(observer(ResetPasswordPage));

const styles = StyleSheet.create({
  ResetPassword: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    marginBottom: 30,
  },
  inputWrapper: {
    width: '100%',
  },
  buttonWrapper: {
    marginTop: 20,
    width: 200,
  },
});
