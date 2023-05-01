import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';

interface OrLineProps {
  style?: Record<string, string | number>;
}

const OrLine = (props: OrLineProps) => {
  const {style} = props;
  const {t} = useTranslation();
  const colors = useColors();

  return (
    <View style={[styles.lineWrapper, style]}>
      <View
        style={[styles.leftPart, {borderColor: colors.secondaryTextColor}]}
      />
      <AppText
        size={TextSize.LEVEL_3}
        text={t('auth.or')}
        style={{color: colors.secondaryTextColor}}
      />
      <View
        style={[styles.rightPart, {borderColor: colors.secondaryTextColor}]}
      />
    </View>
  );
};

export default memo(OrLine);

const styles = StyleSheet.create({
  lineWrapper: {
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'row',
  },
  leftPart: {
    borderStyle: 'solid',
    borderWidth: 0.6,
    width: '40%',
    height: 0,
    position: 'absolute',
    left: 0,
    bottom: '50%',
  },
  rightPart: {
    borderStyle: 'solid',
    borderWidth: 0.6,
    width: '40%',
    height: 0,
    position: 'absolute',
    right: 0,
    bottom: '50%',
  },
});
