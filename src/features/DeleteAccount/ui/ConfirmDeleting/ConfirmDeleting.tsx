import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Input} from '@src/shared/ui/Input/Input';
import deleteAccountStore from '@src/features/DeleteAccount/model/store/DeleteAccountStore';

interface ConfirmDeletingProps {
  onDeleteHandler: () => void;
  onCancelHandler: () => void;
}

const ConfirmDeleting = (props: ConfirmDeletingProps) => {
  const {onDeleteHandler, onCancelHandler} = props;

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
      <Text style={styles.title}>Enter your data</Text>
      <View style={styles.inputs}>
        <Input
          error={deleteAccountStore.errorInfo.emailError}
          value={deleteAccountStore.formData.email}
          style={styles.emailInput}
          label={'Email'}
          placeholder={'Enter email'}
          onChange={onEmailChangeHandler}
        />
        <Input
          error={deleteAccountStore.errorInfo.passwordError}
          value={deleteAccountStore.formData.password}
          label={'Password'}
          placeholder={'Enter password'}
          onChange={onPasswordChangeHandler}
        />
      </View>
      <View style={styles.btns}>
        <Button
          style={styles.cancelBtn}
          theme={ButtonTheme.OUTLINED}
          onPress={onCancelHandler}>
          <Text>cancel</Text>
        </Button>
        <Button
          onPress={onDeleteHandler}
          style={styles.confirmBtn}
          theme={ButtonTheme.OUTLINED}>
          <Text style={styles.confirmText}>confirm</Text>
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
    fontSize: 22,
    fontWeight: '600',
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
