import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';

interface OrLineProps {
  style?: Record<string, string | number>;
}

const OrLine = (props: OrLineProps) => {
  const {style} = props;

  const {t} = useTranslation();

  return (
    <View style={[styles.lineWrapper, style]}>
      <View style={styles.leftPart} />
      <AppText size={TextSize.LEVEL_3} text={t('auth.or')} />
      <View style={styles.rightPart} />
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
    borderColor: '#B6B6BD',
    borderStyle: 'solid',
    borderWidth: 1,
    width: '40%',
    height: 0,
    position: 'absolute',
    left: 0,
    bottom: '50%',
  },
  rightPart: {
    borderColor: '#B6B6BD',
    borderStyle: 'solid',
    borderWidth: 1,
    width: '40%',
    height: 0,
    position: 'absolute',
    right: 0,
    bottom: '50%',
  },
});
