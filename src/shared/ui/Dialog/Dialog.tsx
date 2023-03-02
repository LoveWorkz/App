import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {Button, ButtonTheme} from '../Button/Button';
import {Modal} from '../Modal/Modal';

interface DialogProps {
  confirmText: string;
  onConfirmHandler: () => void;
  title?: string;
  text?: string;
  visible: boolean;
}

export const Dialog = memo((props: DialogProps) => {
  const {confirmText, onConfirmHandler, text, title, visible} = props;

  return (
    <Modal contentStyle={styles.contentStyle} visible={visible}>
      <>
        <View style={styles.topBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>
        {confirmText && (
          <Button
            style={styles.btn}
            theme={ButtonTheme.OUTLINED}
            onPress={onConfirmHandler}>
            <Text style={styles.confirmText}>{confirmText}</Text>
          </Button>
        )}
      </>
    </Modal>
  );
});

const styles = StyleSheet.create<Record<string, any>>({
  contentStyle: {
    height: 'auto',
  },
  btn: {
    width: 100,
    marginLeft: 'auto',
  },
  topBlock: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
});
