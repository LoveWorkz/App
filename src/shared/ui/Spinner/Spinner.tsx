import React, {memo} from 'react';
import {StyleSheet, TextStyle} from 'react-native';
import SP from 'react-native-loading-spinner-overlay/lib';
import {useTranslation} from 'react-i18next';

import {StyleType} from '@src/shared/types/types';
import {useColors} from '@src/app/providers/colorsProvider';
import {globalStyles} from '@src/app/styles/GlobalStyle';

interface AppTextProps {
  visible: boolean;
  style?: StyleType;
}

export const Spinner = memo((props: AppTextProps) => {
  const {style, visible} = props;

  const colors = useColors();
  const {t} = useTranslation();

  return (
    <SP
      visible={visible}
      textContent={`${t('common.loading')}...`}
      textStyle={
        [
          styles.spinnerTextStyle,
          {color: colors.primaryTextColor},
          style,
        ] as TextStyle
      }
    />
  );
});

const styles = StyleSheet.create({
  spinnerTextStyle: {
    // ...globalStyles.textFont,
    ...globalStyles.size_6,
  },
});
