import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Input} from '@src/shared/ui/Input/Input';
import {useColors} from '@src/app/providers/colorsProvider';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize, TextType} from '@src/shared/ui/AppText/AppText';
import changePasswordStore from '../model/store/ChangePasswordStore';

const ChangePasswordPage = () => {
  const {t} = useTranslation();
  const colors = useColors();

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
          label={t('auth.current_password')}
          value={changePasswordStore.formData.oldPassword}
          onChange={onChangeOldPasswordHandler}
          placeholder={t('auth.enter_current_password')}
          error={t(changePasswordStore.errorInfo.oldPasswordError)}
        />
      </View>
      <View style={styles.item}>
        <Input
          secureTextEntry
          label={t('auth.new_assword')}
          value={changePasswordStore.formData.newPassword}
          onChange={onChangeNewPasswordHandler}
          placeholder={t('auth.enter_new_password')}
        />
        {changePasswordStore.errorInfo.passwordError && (
          <AppText
            type={TextType.ERROR}
            size={TextSize.LEVEL_1}
            weight={'500'}
            text={t(changePasswordStore.errorInfo.passwordError)}
          />
        )}
      </View>
      <View style={styles.item}>
        <Input
          secureTextEntry
          label={t('auth.repeat_password')}
          value={changePasswordStore.formData.confirmPassword}
          onChange={onChangeRepeatPasswordHandler}
          error={t(changePasswordStore.errorInfo.confirmPasswordError)}
          placeholder={t('auth.repeat_new_password')}
        />
      </View>
      <Button
        disabled={changePasswordStore.isLoading}
        style={styles.btn}
        theme={ButtonTheme.GRADIENT}
        onPress={onPressHandler}>
        <AppText
          style={{color: colors.bgQuinaryColor}}
          size={TextSize.LEVEL_4}
          text={t('common.save')}
        />
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
    marginBottom: verticalScale(15),
  },
  btn: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
});
