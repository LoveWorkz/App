import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import Pagination from '@src/shared/ui/HorizontalSlide/Pagination';
import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';

interface CoreChallengeCardsFooterProps {
  count: number;
  currentIndex: number;
}

const CoreChallengeCardsFooter = (props: CoreChallengeCardsFooterProps) => {
  const {count, currentIndex} = props;

  const colors = useColors();

  return (
    <View style={styles.footer}>
      <Pagination isWhite={true} currentIndex={currentIndex} count={count} />
      <AppText
        size={TextSize.LEVEL_2}
        style={[styles.text, {color: colors.white}]}
        align={'center'}
        lineHeight={15}
        weight={'600'}
        text={'Lock one of the challenges'}
      />
    </View>
  );
};

export default memo(CoreChallengeCardsFooter);

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: verticalScale(40),
    alignItems: 'center',
  },
  text: {
    textTransform: 'uppercase',
  },
});
