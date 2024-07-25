import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {SwipeIcon} from '@src/shared/assets/icons/Swipe';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useTranslation} from 'react-i18next';

const SwipeToProceed = () => {
  const {t} = useTranslation();
  return (
    <View style={styles.SwipeToProceed}>
      <SvgXml xml={SwipeIcon} style={styles.icon} />
      <AppText
        weight={'700'}
        text={t('common.swipe_to_proceed')}
        size={TextSize.LEVEL_4}
      />
    </View>
  );
};

export default memo(SwipeToProceed);

const styles = StyleSheet.create({
  SwipeToProceed: {
    alignItems: 'center',
  },
  icon: {
    height: verticalScale(52),
    width: horizontalScale(30),
  },
});
