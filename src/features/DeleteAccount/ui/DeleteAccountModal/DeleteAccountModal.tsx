import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import deleteAccountStore from '../../model/store/DeleteAccountStore';
import {Wrapper as ConfirmDeleting} from '../ConfirmDeleting/ConfirmDeleting';
import {AuthMethod, userStore} from '@src/entities/User';
import {Modal} from '@src/shared/ui/Modal/Modal';

interface LogOutModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const DeleteAccountModal = (props: LogOutModalProps) => {
  const {visible, setVisible} = props;
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
  }, [setVisible]);

  return (
    <SafeAreaView>
      <Modal
        contentStyle={styles.content}
        visible={visible}
        setVisible={setVisible}>
        {isConfirm ? (
          <ConfirmDeleting
            onDeleteHandler={deleteAuthUser}
            onCancelHandler={onCancelHandler}
          />
        ) : (
          <>
            <Text style={styles.title}>Delete your account ?</Text>
            <Text style={styles.text}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit ipsum
              dolor.
            </Text>
            <View style={styles.btnGroup}>
              <Button
                disabled={deleteAccountStore.isLoading}
                style={styles.cancelBtn}
                theme={ButtonTheme.OUTLINED}
                onPress={onCancelHandler}>
                <Text style={styles.cancel}>cancel</Text>
              </Button>
              <Button
                disabled={deleteAccountStore.isLoading}
                theme={ButtonTheme.OUTLINED}
                style={styles.logOutBtn}
                onPress={onDeleteHandler}>
                <Text style={styles.logOut}>delete</Text>
              </Button>
            </View>
          </>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export const Wrapper = memo(observer(DeleteAccountModal));

const fontSize = 16;
const btnWidth = '40%';

const styles = StyleSheet.create({
  content: {
    height: 280,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
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
    fontSize,
  },
  cancel: {
    fontSize,
  },
});
