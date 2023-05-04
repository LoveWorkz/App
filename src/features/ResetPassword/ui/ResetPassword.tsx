import React, {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {TextSize} from '@src/shared/ui/AppText/AppText';
import {Dialog} from '@src/shared/ui/Dialog/Dialog';
import {Button} from '@src/shared/ui/Button/Button';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import ResetPasswordModal from './ResetPasswordModal';
import resetPasswordStore from '../model/store/ResetPasswordStore';

const ResetPassword = () => {
  const {t} = useTranslation();

  const onClickHandler = () => {
    resetPasswordStore.setResetPasswordModalVisible(true);
  };

  const onConfirmHandler = useCallback(() => {
    resetPasswordStore.toggleCheckEmailDialog(false);
  }, []);

  return (
    <View>
      <Button onPress={onClickHandler}>
        <GradientText
          size={TextSize.LEVEL_3}
          weight={'600'}
          text={t('auth.forgot_password')}
        />
      </Button>
      <ResetPasswordModal />
      {resetPasswordStore.isCheckEmailDialogOpen ? (
        <Dialog
          visible={resetPasswordStore.isCheckEmailDialogOpen}
          confirmText={'ok'}
          onConfirmHandler={onConfirmHandler}
          title={t('auth.check_your_email') || ''}
        />
      ) : (
        <></>
      )}
    </View>
  );
};

export default memo(observer(ResetPassword));
