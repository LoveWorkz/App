import React, {ReactElement, useCallback} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import Popup from 'react-native-modal';
import {SvgXml} from 'react-native-svg';

import {useColors} from '@src/app/providers/colorsProvider';
import {CloseIcon} from '@src/shared/assets/icons/Close';
import {moderateScale} from '@src/shared/lib/Metrics';
import {globalStyles, windowWidth} from '@src/app/styles/GlobalStyle';
import {Button} from '../Button/Button';

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
  backdropTransparent?: boolean;
}

export const Modal = (props: ModalProps) => {
  const {
    visible,
    children,
    contentStyle,
    onClose,
    isCloseIcon = false,
    theme = 'center',
    backdropTransparent,
  } = props;

  const colors = useColors();
  const isThemeBottom = theme === 'bottom';

  const onCancelHandler = useCallback(() => {
    onClose?.();
  }, [onClose]);

  return (
    <>
      {visible && (
        <Popup
          backdropOpacity={backdropTransparent ? 0 : 0.6}
          onBackdropPress={onCancelHandler}
          statusBarTranslucent
          animationInTiming={300}
          animationIn={'slideInUp'}
          backdropColor={colors.bgPopup}
          isVisible={visible}
          deviceHeight={Dimensions.get('screen').height}>
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
