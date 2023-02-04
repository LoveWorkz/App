import React, {memo, useCallback} from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import Modal from 'react-native-modal';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {modalContentStyle} from '@src/app/styles';
import DeleteAccountStore from '../../model/store/DeleteAccountStore';

interface LogOutModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const DeleteAccountModal = (props: LogOutModalProps) => {
  const {visible, setVisible} = props;

  const onDeleteHandler = useCallback(() => {
    DeleteAccountStore.deleteUserAccount().then(() => {
      setVisible?.(false);
    });
  }, [setVisible]);

  const onCancelHandler = useCallback(() => {
    setVisible?.(false);
  }, [setVisible]);

  return (
    <SafeAreaView>
      <Modal
        backdropTransitionOutTiming={600}
        animationInTiming={500}
        animationIn={'bounceIn'}
        animationOut={'bounce'}
        onBackdropPress={onCancelHandler}
        isVisible={visible}>
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title}>Delete your account ?</Text>

            <Text style={styles.text}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit ipsum
              dolor.
            </Text>

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
                onPress={onDeleteHandler}>
                <Text style={styles.logOut}>delete</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export const Wrapper = memo(DeleteAccountModal);

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
