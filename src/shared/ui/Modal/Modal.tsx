import React, {ReactElement, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import Popup from 'react-native-modal';

export enum Animation {
  BOUNCEIN = 'bounceIn',
  SLIDEIN_UP = 'slideInUp',
}

interface ModalProps {
  visible: boolean;
  children: ReactElement | ReactElement[];
  contentStyle?:
    | Record<string, string | number>[]
    | Record<string, string | number>;
  animationIn?: Animation;
  onClose?: () => void;
}

export const Modal = (props: ModalProps) => {
  const {
    visible,
    children,
    contentStyle,
    animationIn = Animation.BOUNCEIN,
    onClose,
  } = props;

  const onCancelHandler = useCallback(() => {
    onClose?.();
  }, [onClose]);

  return (
    <>
      {visible && (
        <Popup
          backdropOpacity={0.6}
          onBackdropPress={onCancelHandler}
          statusBarTranslucent
          animationInTiming={300}
          animationIn={animationIn}
          isVisible={visible}>
          <View style={[styles.content, contentStyle]}>{children}</View>
        </Popup>
      )}
    </>
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
});
