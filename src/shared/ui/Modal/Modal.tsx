import React, {ReactElement, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import Popup from 'react-native-modal';
import {SvgXml} from 'react-native-svg';

import {useColors} from '@src/app/providers/colorsProvider';
import {CloseIcon} from '@src/shared/assets/icons/Close';
import {globalStyles, windowWidth} from '@src/app/styles/GlobalStyle';
import {Button} from '../Button/Button';
import {moderateScale} from '@src/shared/lib/Metrics';

type ModalTheme = 'center' | 'bottom';

interface ModalProps {
  visible: boolean;
  children: ReactElement | ReactElement[];
  contentStyle?:
    | Record<string, string | number>[]
    | Record<string, string | number>;
  onClose?: () => void;
  isCloseIcon?: boolean;
  theme?: ModalTheme;
}

export const Modal = (props: ModalProps) => {
  const {
    visible,
    children,
    contentStyle,
    onClose,
    isCloseIcon = false,
    theme = 'center',
  } = props;

  const colors = useColors();
  const isThemeBottom = theme === 'bottom';

  const animationType = isThemeBottom ? 'slideInUp' : 'bounceIn';

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
          animationIn={animationType}
          backdropColor={colors.bgPopup}
          isVisible={visible}>
          <View
            style={[
              styles.content,
              {
                backgroundColor: colors.bgColor,
              },
              isThemeBottom && styles.button,
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
    minHeight: 240,
    padding: 30,
  },
  button: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: windowWidth,
    borderRadius: 0,
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
  },
  closeIconWrapper: {
    position: 'absolute',
    top: 15,
    right: 25,
    ...globalStyles.modalCloseIconZIndex,
  },
});
