import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Input} from '@src/shared/ui/Input/Input';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import deleteAccountStore from '../../model/store/DeleteAccountStore';

interface ConfirmDeletingProps {
  onDeleteHandler: () => void;
  onCancelHandler: () => void;
}

const ConfirmDeleting = (props: ConfirmDeletingProps) => {
  const {onDeleteHandler, onCancelHandler} = props;
  const {t} = useTranslation();
  const colors = useColors();

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
    <View style={styles.confirm}>
      <AppText
        style={[styles.title, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_6}
        text={t('enter_your_data')}
      />
      <View style={styles.inputs}>
        <Input
          error={t(deleteAccountStore.errorInfo.emailError)}
          value={deleteAccountStore.formData.email}
          style={styles.emailInput}
          label={t('auth.email')}
          placeholder={t('auth.enter_email')}
          onChange={onEmailChangeHandler}
        />
        <Input
          secureTextEntry
          error={t(deleteAccountStore.errorInfo.passwordError)}
          value={deleteAccountStore.formData.password}
          label={t('auth.password')}
          placeholder={t('auth.enter_password')}
          onChange={onPasswordChangeHandler}
        />
      </View>
      <View style={styles.btns}>
        <Button
          disabled={deleteAccountStore.isLoading}
          style={styles.cancelBtn}
          theme={ButtonTheme.OUTLINED_GRADIENT}
          onPress={onCancelHandler}>
          <GradientText size={TextSize.LEVEL_4} text={t('cancel')} />
        </Button>
        <Button
          disabled={deleteAccountStore.isLoading}
          onPress={onDeleteHandler}
          style={styles.confirmBtn}
          theme={ButtonTheme.GRADIENT}>
          <AppText
            style={{color: colors.bgQuinaryColor}}
            size={TextSize.LEVEL_4}
            text={t('confirm')}
          />
        </Button>
      </View>
    </View>
  );
};

export default memo(observer(ConfirmDeleting));

const btnWidth = '45%';

const styles = StyleSheet.create({
  confirm: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    marginBottom: verticalScale(10),
  },
  btns: {
    marginTop: verticalScale(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  confirmBtn: {
    marginLeft: 'auto',
    width: btnWidth,
  },
  cancelBtn: {
    width: btnWidth,
  },
  inputs: {
    width: '100%',
    marginTop: verticalScale(10),
  },
  emailInput: {
    marginBottom: verticalScale(15),
  },
});
