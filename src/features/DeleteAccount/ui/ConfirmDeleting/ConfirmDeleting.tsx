import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Input} from '@src/shared/ui/Input/Input';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import deleteAccountStore from '../../model/store/DeleteAccountStore';

interface ConfirmDeletingProps {
  onDeleteHandler: () => void;
  onCancelHandler: () => void;
}

const ConfirmDeleting = (props: ConfirmDeletingProps) => {
  const {onDeleteHandler, onCancelHandler} = props;
  const {t} = useTranslation();

  useEffect(() => {
    return () => deleteAccountStore.resetForm();
  }, []);

  const onEmailChangeHandler = useCallback((value: string) => {
    deleteAccountStore.setEmail(value);
  }, []);

  const onPasswordChangeHandler = useCallback((value: string) => {
    deleteAccountStore.setPassword(value);
  }, []);

  return (
    <SafeAreaView style={styles.confirm}>
      <AppText
        style={styles.title}
        size={TextSize.LEVEL_6}
        text={t('enter_your_data')}
      />
      <View style={styles.inputs}>
        <Input
          error={deleteAccountStore.errorInfo.emailError}
          value={deleteAccountStore.formData.email}
          style={styles.emailInput}
          label={t('auth.email') || ''}
          placeholder={t('auth.enter_email') || ''}
          onChange={onEmailChangeHandler}
        />
        <Input
          secureTextEntry
          error={deleteAccountStore.errorInfo.passwordError}
          value={deleteAccountStore.formData.password}
          label={t('auth.password') || ''}
          placeholder={t('auth.enter_password') || ''}
          onChange={onPasswordChangeHandler}
        />
      </View>
      <View style={styles.btns}>
        <Button
          disabled={deleteAccountStore.isLoading}
          style={styles.cancelBtn}
          theme={ButtonTheme.OUTLINED}
          onPress={onCancelHandler}>
          <AppText size={TextSize.LEVEL_4} text={t('cancel')} />
        </Button>
        <Button
          disabled={deleteAccountStore.isLoading}
          onPress={onDeleteHandler}
          style={styles.confirmBtn}
          theme={ButtonTheme.OUTLINED}>
          <AppText
            style={styles.confirmText}
            size={TextSize.LEVEL_4}
            text={t('confirm')}
          />
        </Button>
      </View>
    </SafeAreaView>
  );
};

export const Wrapper = memo(observer(ConfirmDeleting));

const btnWidth = '40%';

const styles = StyleSheet.create({
  confirm: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    marginBottom: 10,
  },
  btns: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  confirmBtn: {
    backgroundColor: 'black',
    marginLeft: 'auto',
    width: btnWidth,
  },
  cancelBtn: {
    width: btnWidth,
  },
  confirmText: {
    color: 'white',
  },
  inputs: {
    width: '100%',
    marginTop: 10,
  },
  emailInput: {
    marginBottom: 15,
  },
});
