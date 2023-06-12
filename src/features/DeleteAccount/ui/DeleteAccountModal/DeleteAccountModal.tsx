import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AuthMethod, userStore} from '@src/entities/User';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import deleteAccountStore from '../../model/store/DeleteAccountStore';
import {Wrapper as ConfirmDeleting} from '../ConfirmDeleting/ConfirmDeleting';

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
    <SafeAreaView>
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
              style={[styles.text, {color: colors.primaryTextColor}]}
              size={TextSize.LEVEL_4}
              text={
                'Lorem ipsum dolor sit amet, consectetuer adipiscing elit ipsum dolor'
              }
            />
            <View style={styles.btnGroup}>
              <Button
                disabled={deleteAccountStore.isLoading}
                style={styles.cancelBtn}
                theme={ButtonTheme.OUTLINED_GRADIENT}
                onPress={onCancelHandler}>
                <GradientText
                  weight={'700'}
                  size={TextSize.LEVEL_4}
                  text={t('cancel')}
                />
              </Button>
              <Button
                disabled={deleteAccountStore.isLoading}
                theme={ButtonTheme.GRADIENT}
                style={styles.logOutBtn}
                onPress={onDeleteHandler}>
                <AppText
                  style={{color: colors.bgQuinaryColor}}
                  size={TextSize.LEVEL_4}
                  text={t('delete')}
                />
              </Button>
            </View>
          </>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export const Wrapper = memo(observer(DeleteAccountModal));

const btnWidth = '45%';

const styles = StyleSheet.create({
  content: {
    height: 290,
  },
  text: {
    textAlign: 'center',
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  logOutBtn: {
    width: btnWidth,
  },
  cancelBtn: {
    width: btnWidth,
  },
});
