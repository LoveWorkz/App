import React, {memo, useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Modal from 'react-native-modal';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {modalContentStyle} from '@src/app/styles';
import logoutStore from '../modal/store/logoutStore';

interface LogOutModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const LogOutModal = (props: LogOutModalProps) => {
  const {visible, setVisible} = props;

  const onlogoutHandler = useCallback(() => {
    logoutStore.logout().then(() => {
      setVisible?.(false);
    });
  }, [setVisible]);

  const onCancelHandler = useCallback(() => {
    setVisible?.(false);
  }, [setVisible]);

  return (
    <View>
      <Modal
        animationInTiming={300}
        animationIn={'bounceIn'}
        onBackdropPress={onCancelHandler}
        isVisible={visible}>
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title}>Log out ?</Text>

            <View style={styles.btnGroup}>
              <Button
                style={styles.cancelBtn}
                theme={ButtonTheme.OUTLINED}
                onPress={onCancelHandler}>
                <Text style={styles.cancel}>cancel</Text>
              </Button>
              <Button
                theme={ButtonTheme.OUTLINED}
                style={styles.logOutBtn}
                onPress={onlogoutHandler}>
                <Text style={styles.logOut}>log out</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const Wrapper = memo(LogOutModal);

const fontSize = 16;
const btnWidth = '40%';

const styles = StyleSheet.create({
  content: {
    ...(modalContentStyle as Record<string, string | number>),
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
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
