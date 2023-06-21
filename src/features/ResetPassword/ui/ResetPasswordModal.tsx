import React, {memo, useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {useColors} from '@src/app/providers/colorsProvider';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Input} from '@src/shared/ui/Input/Input';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {verticalScale} from '@src/shared/lib/Metrics';
import resetPasswordStore from '../model/store/ResetPasswordStore';

const ResetPasswordModal = () => {
  const {t} = useTranslation();
  const colors = useColors();

  useEffect(() => {
    return () => resetPasswordStore.resetForm();
  }, []);

  const onChangeHandler = useCallback((text: string) => {
    resetPasswordStore.setEmail(text);
  }, []);

  const onClickHandler = useCallback(() => {
    resetPasswordStore.sendPasswordResetEmail();
  }, []);

  const onCancelHandler = () => {
    resetPasswordStore.setResetPasswordModalVisible(false);
  };

  return (
    <Modal
      contentStyle={styles.content}
      visible={resetPasswordStore.isResetPasswordModalVisible}
      onClose={onCancelHandler}>
      <AppText
        style={{color: colors.primaryTextColor}}
        size={TextSize.LEVEL_6}
        weight={'600'}
        text={t('auth.forgot_password')}
      />
      <AppText
        style={{color: colors.primaryTextColor}}
        size={TextSize.LEVEL_3}
        weight={'600'}
        text={t('auth.enter_your_email_to_get_the_reset_link')}
      />
      <View style={styles.inputWrapper}>
        <Input
          label={t('auth.email') || ''}
          placeholder={t('auth.enter_email') || ''}
          value={resetPasswordStore.email}
          onChange={onChangeHandler}
          error={resetPasswordStore.emailError}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          disabled={resetPasswordStore.isloading}
          onPress={onClickHandler}
          theme={ButtonTheme.GRADIENT}>
          <AppText
            style={{color: colors.bgQuinaryColor}}
            size={TextSize.LEVEL_4}
            weight={'700'}
            text={t('auth.send_link')}
          />
        </Button>
      </View>
    </Modal>
  );
};

export default memo(observer(ResetPasswordModal));

const styles = StyleSheet.create({
  content: {
    minHeight: verticalScale(310),
  },
  inputWrapper: {
    width: '100%',
  },
  buttonWrapper: {
    marginTop: verticalScale(20),
    width: '100%',
  },
});
