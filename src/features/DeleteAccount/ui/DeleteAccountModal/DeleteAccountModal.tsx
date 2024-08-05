import React, {memo, useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AuthMethod, userStore} from '@src/entities/User';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import deleteAccountStore from '../../model/store/DeleteAccountStore';
import ConfirmDeleting from '../ConfirmDeleting/ConfirmDeleting';

interface DeleteAccountModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const DeleteAccountModal = (props: DeleteAccountModalProps) => {
  const {visible, setVisible} = props;
  const {t} = useTranslation();
  const colors = useColors();

  const [isConfirm, setIsConfirm] = useState(false);

  const onCancelHandler = useCallback(() => {
    setVisible?.(false);
    setIsConfirm(false);
  }, [setVisible]);

  const deleteAuthUser = useCallback(() => {
    deleteAccountStore.deleteUserAccount(() => {
      onCancelHandler();
    });
  }, [onCancelHandler]);

  const onDeleteHandler = () => {
    if (userStore.authMethod === AuthMethod.AUTH_BY_EMAIL) {
      setIsConfirm(true);
      return;
    }
    deleteAuthUser();
  };

  return (
    <Modal
      contentStyle={styles.content}
      visible={visible}
      onClose={onCancelHandler}>
      {isConfirm ? (
        <ConfirmDeleting
          onDeleteHandler={deleteAuthUser}
          onCancelHandler={onCancelHandler}
        />
      ) : (
        <>
          <AppText
            style={{color: colors.primaryTextColor}}
            weight={'600'}
            size={TextSize.LEVEL_6}
            text={`${t('auth.delete_your_account')}?`}
          />
          <AppText
            style={[styles.description, {color: colors.primaryTextColor}]}
            size={TextSize.LEVEL_4}
            text={t('auth.delete_your_account_description')}
            weight={'600'}
          />
          <Button
            disabled={deleteAccountStore.isLoading}
            theme={ButtonTheme.GRADIENT}
            style={styles.logOutBtn}
            onPress={onDeleteHandler}>
            <AppText
              style={{color: colors.bgQuinaryColor}}
              size={TextSize.LEVEL_4}
              text={t('common.delete')}
            />
          </Button>
          <Button
            disabled={deleteAccountStore.isLoading}
            style={styles.cancelBtn}
            theme={ButtonTheme.CLEAR}
            onPress={onCancelHandler}>
            <AppText
              style={styles.cancelText}
              weight={'700'}
              size={TextSize.LEVEL_4}
              text={t('common.cancel')}
            />
          </Button>
        </>
      )}
    </Modal>
  );
};

export default memo(observer(DeleteAccountModal));

const styles = StyleSheet.create({
  content: {
    minHeight: verticalScale(270),
    paddingBottom: 20,
  },
  description: {
    textAlign: 'center',
    marginBottom: verticalScale(20),
    marginTop: verticalScale(5),
  },
  logOutBtn: {
    width: '100%',
  },
  cancelBtn: {
    paddingHorizontal: horizontalScale(20),
  },
  cancelText: {
    textDecorationLine: 'underline',
  },
});
