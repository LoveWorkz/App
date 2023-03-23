import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AuthMethod, userStore} from '@src/entities/User';
import {Modal} from '@src/shared/ui/Modal/Modal';
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
  const [isConfirm, setIsConfirm] = useState(false);

  const deleteAuthUser = useCallback(() => {
    deleteAccountStore.deleteUserAccount(() => {
      setVisible?.(false);
    });
  }, [setVisible]);

  const onDeleteHandler = () => {
    if (userStore.authMethod === AuthMethod.AUTH_BY_EMAIL) {
      setIsConfirm(true);
      return;
    }
    deleteAuthUser();
  };
  const onCancelHandler = useCallback(() => {
    setVisible?.(false);
    setIsConfirm(false);
  }, [setVisible]);

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
              weight={'600'}
              size={TextSize.LEVEL_6}
              text={`${t('auth.delete_your_account')} ?`}
            />
            <AppText
              style={styles.text}
              size={TextSize.LEVEL_4}
              text={
                'Lorem ipsum dolor sit amet, consectetuer adipiscing elit ipsum dolor'
              }
            />
            <View style={styles.btnGroup}>
              <Button
                disabled={deleteAccountStore.isLoading}
                style={styles.cancelBtn}
                theme={ButtonTheme.OUTLINED}
                onPress={onCancelHandler}>
                <AppText
                  weight={'700'}
                  size={TextSize.LEVEL_4}
                  text={t('cancel')}
                />
              </Button>
              <Button
                disabled={deleteAccountStore.isLoading}
                theme={ButtonTheme.OUTLINED}
                style={styles.logOutBtn}
                onPress={onDeleteHandler}>
                <AppText
                  style={styles.logOut}
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

const btnWidth = '40%';

const styles = StyleSheet.create({
  content: {
    height: 280,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  logOutBtn: {
    backgroundColor: 'black',
    width: btnWidth,
  },
  cancelBtn: {
    width: btnWidth,
  },
  logOut: {
    color: 'white',
  },
});
