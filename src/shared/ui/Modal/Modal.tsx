import React, {ReactElement, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import Popup from 'react-native-modal';

export enum Animation {
  BOUNCEIN = 'bounceIn',
  SLIDEIN_UP = 'slideInUp',
}

interface ModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  children: ReactElement | ReactElement[];
  contentStyle?:
    | Record<string, string | number>[]
    | Record<string, string | number>;
  animationIn?: Animation;
}

export const Modal = (props: ModalProps) => {
  const {
    visible,
    setVisible,
    children,
    contentStyle,
    animationIn = Animation.BOUNCEIN,
  } = props;

  const onCancelHandler = useCallback(() => {
    setVisible?.(false);
  }, [setVisible]);

  return (
    <Popup
      statusBarTranslucent
      animationInTiming={300}
      animationIn={animationIn}
      onBackdropPress={onCancelHandler}
      isVisible={visible}>
      <View style={styles.overlay}>
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    </Popup>
  );
};

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    height: 240,
    padding: 30,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
});
