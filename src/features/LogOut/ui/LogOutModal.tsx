import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Modal} from '@src/shared/ui/Modal/Modal';
import logoutStore from '../modal/store/logoutStore';

interface LogOutModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const LogOutModal = (props: LogOutModalProps) => {
  const {visible, setVisible} = props;

  const actionAfterLogout = () => {
    setVisible(false);
  };

  const onlogoutHandler = () => {
    logoutStore.logout(actionAfterLogout);
  };

  const onCancelHandler = () => {
    setVisible?.(false);
  };

  return (
    <Modal visible={visible} onClose={onCancelHandler}>
      <Text style={styles.title}>Log out ?</Text>
      <View style={styles.btnGroup}>
        <Button
          disabled={logoutStore.isLoading}
          style={styles.cancelBtn}
          theme={ButtonTheme.OUTLINED}
          onPress={onCancelHandler}>
          <Text style={styles.cancel}>cancel</Text>
        </Button>
        <Button
          disabled={logoutStore.isLoading}
          theme={ButtonTheme.OUTLINED}
          style={styles.logOutBtn}
          onPress={onlogoutHandler}>
          <Text style={styles.logOut}>log out</Text>
        </Button>
      </View>
    </Modal>
  );
};

export const Wrapper = memo(observer(LogOutModal));

const fontSize = 16;
const btnWidth = '40%';

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '600',
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
