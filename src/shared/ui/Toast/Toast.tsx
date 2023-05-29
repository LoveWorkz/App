import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import ToastMessage, {
  BaseToast,
  ToastConfig,
  ToastProps,
} from 'react-native-toast-message';

import {useColors} from '@src/app/providers/colorsProvider';
import {ColorType} from '@src/app/styles/themeStyle';
import {moderateScale, verticalScale} from '@src/shared/lib/Metrics';

const getToastConfig = (colors: ColorType): ToastConfig => ({
  // adding new type
  warning: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={[
        styles.warning,
        {
          borderLeftColor: colors.orange,
          backgroundColor: colors.bgTertiaryColor,
        },
      ]}
      text1Style={[
        styles.warningText,
        {
          color: colors.primaryTextColor,
        },
      ]}
    />
  ),
});

export enum ToastType {
  WARNING = 'warning',
  ERROR = 'error',
}

export const Toast = memo(() => {
  const colors = useColors();

  return <ToastMessage config={getToastConfig(colors)} />;
});

const styles = StyleSheet.create({
  warning: {
    height: verticalScale(80),
  },
  warningText: {
    fontSize: moderateScale(20),
  },
});
