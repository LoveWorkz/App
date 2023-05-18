import React, {ReactElement, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import Popup from 'react-native-modal';
import {SvgXml} from 'react-native-svg';

import {useColors} from '@src/app/providers/colorsProvider';
import {CloseIcon} from '@src/shared/assets/icons/Close';
import {globalStyles} from '@src/app/styles/GlobalStyle';
import {Button} from '../Button/Button';

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
  isCloseIcon?: boolean;
}

export const Modal = (props: ModalProps) => {
  const {
    visible,
    children,
    contentStyle,
    animationIn = Animation.BOUNCEIN,
    onClose,
    isCloseIcon = false,
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
              {backgroundColor: colors.bgQuaternaryColor},
              contentStyle,
            ]}>
            {isCloseIcon && (
              <Button onPress={onCancelHandler} style={styles.closeIconWrapper}>
                <SvgXml
                  xml={CloseIcon}
                  fill={colors.primaryTextColor}
                  height={13}
                  width={13}
                />
              </Button>
            )}
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
  closeIconWrapper: {
    position: 'absolute',
    top: 15,
    right: 25,
    ...globalStyles.modalCloseIconZIndex,
  },
});
