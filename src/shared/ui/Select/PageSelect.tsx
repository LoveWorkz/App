import React, {ReactElement} from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {ArrowLeftIcon} from '@src/shared/assets/icons/ArrowLeft';

interface PageSelectProps {
  visible: boolean;
  onClose: () => void;
  prompt?: string;
  children: ReactElement;
}

export const PageSelect = (props: PageSelectProps) => {
  const {visible, onClose, prompt, children} = props;

  if (!visible) {
    return <></>;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}>
      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.arrowLeft}>
            <SvgXml xml={ArrowLeftIcon} />
          </TouchableOpacity>

          {prompt && <Text style={styles.title}>{prompt}</Text>}
        </View>
        {children}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create<Record<string, any>>({
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 50,
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
