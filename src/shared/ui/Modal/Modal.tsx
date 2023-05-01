import React, {ReactElement, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import Popup from 'react-native-modal';

import {useColors} from '@src/app/providers/colorsProvider';

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

  const colors = useColors();

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
          <View
            style={[
              styles.content,
              contentStyle,
              {backgroundColor: colors.bgQuaternaryColor},
            ]}>
            {children}
          </View>
        </Popup>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    borderRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: 240,
    padding: 30,
  },
});
