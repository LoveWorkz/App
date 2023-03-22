import React, {ReactElement} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {ArrowLeftIcon} from '@src/shared/assets/icons/ArrowLeft';
import {Animation, Modal as CustomModal} from '../Modal/Modal';

interface DialogSelectProps {
  visible: boolean;
  onClose: () => void;
  prompt?: string;
  children: ReactElement;
}

export const DialogSelect = (props: DialogSelectProps) => {
  const {visible, onClose, prompt, children} = props;

  return (
    <CustomModal
      contentStyle={styles.dialogContent}
      animationIn={Animation.SLIDEIN_UP}
      visible={visible}
      onClose={onClose}>
      {prompt ? (
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.arrowLeft}>
            <SvgXml xml={ArrowLeftIcon} />
          </TouchableOpacity>

          <Text style={styles.title}>{prompt}</Text>
        </View>
      ) : (
        <></>
      )}
      {children}
    </CustomModal>
  );
};

const styles = StyleSheet.create<Record<string, any>>({
  dialogContent: {
    width: '100%',
    padding: 0,
    height: 'auto',
    maxHeight: '60%',
    alignItems: 'flex-start',
  },
  header: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D0D2D3',
    borderBottomStyle: 'solid',
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
  },
  arrowLeft: {
    height: 20,
    width: 20,
    position: 'absolute',
    left: 15,
  },
});
