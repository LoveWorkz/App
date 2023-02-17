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
          secureTextEntry
          label={'Current password'}
          value={changePasswordStore.formData.oldPassword}
          onChange={onChangeOldPasswordHandler}
          placeholder={'Enter current password'}
          error={changePasswordStore.errorInfo.oldPasswordError}
        />
      </View>
      <View style={styles.item}>
        <Input
          secureTextEntry
          label={'New password'}
          value={changePasswordStore.formData.newPassword}
          onChange={onChangeNewPasswordHandler}
          placeholder={'Enter new password'}
        />
        {changePasswordStore.errorInfo.passwordError && (
          <Text style={styles.passwordErrorText}>
            {changePasswordStore.errorInfo.passwordError}
          </Text>
        )}
      </View>
      <View style={styles.item}>
        <Input
          secureTextEntry
          label={'Repeat password'}
          value={changePasswordStore.formData.confirmPassword}
          onChange={onChangeRepeatPasswordHandler}
          error={changePasswordStore.errorInfo.confirmPasswordError}
          placeholder={'Enter repeat password'}
        />
      </View>
      <Button
        disabled={changePasswordStore.isLoading}
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
    marginBottom: 15,
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
  passwordErrorText: {
    color: 'red',
  },
});
