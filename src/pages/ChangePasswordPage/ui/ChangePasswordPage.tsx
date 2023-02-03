import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Input} from '@src/shared/ui/Input/Input';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import changePasswordStore from '../model/store/ChangePasswordStore';

const ChangePasswordPage = () => {
  useEffect(() => {
    return () => changePasswordStore.resetForm();
  }, []);

  const onPressHandler = useCallback(() => {
    changePasswordStore.changePassword();
  }, []);

  const onChangeOldPasswordHandler = useCallback((value: string) => {
    changePasswordStore.setOldPassword(value);
  }, []);

  const onChangeNewPasswordHandler = useCallback((value: string) => {
    changePasswordStore.setNewPassword(value);
  }, []);

  const onChangeRepeatPasswordHandler = useCallback((value: string) => {
    changePasswordStore.setConfirmPassword(value);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Input
          label={'Current password'}
          value={changePasswordStore.formData.oldPassword}
          onChange={onChangeOldPasswordHandler}
          placeholder={'Enter current password'}
        />
        {changePasswordStore.errorInfo.oldPasswordError && (
          <Text style={styles.errorText}>
            {changePasswordStore.errorInfo.oldPasswordError}
          </Text>
        )}
      </View>
      <View style={styles.item}>
        <Input
          label={'New password'}
          value={changePasswordStore.formData.newPassword}
          onChange={onChangeNewPasswordHandler}
          placeholder={'Enter new password'}
        />
        {changePasswordStore.errorInfo.newPasswordError && (
          <Text style={styles.errorText}>
            {changePasswordStore.errorInfo.newPasswordError}
          </Text>
        )}
      </View>
      <View style={styles.item}>
        <Input
          label={'Repeat password'}
          value={changePasswordStore.formData.confirmPassword}
          onChange={onChangeRepeatPasswordHandler}
          placeholder={'Enter repeat password'}
        />
        {changePasswordStore.errorInfo.confirmPasswordError && (
          <Text style={styles.errorText}>
            {changePasswordStore.errorInfo.confirmPasswordError}
          </Text>
        )}
      </View>
      <Button
        style={styles.btn}
        theme={ButtonTheme.OUTLINED}
        onPress={onPressHandler}>
        <Text style={styles.text}>Save</Text>
      </Button>
    </View>
  );
};

export const Wrapper = memo(observer(ChangePasswordPage));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  item: {
    marginBottom: 10,
  },
  btn: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
  },
  errorText: {
    color: 'red',
  },
});
