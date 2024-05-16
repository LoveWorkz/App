import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import Pagination from '@src/shared/ui/HorizontalSlide/Pagination';
import {verticalScale} from '@src/shared/lib/Metrics';

interface ChallengeCardsFooterProps {
  count: number;
  currentIndex: number;
}

const ChallengeCardsFooter = (props: ChallengeCardsFooterProps) => {
  const {count, currentIndex} = props;

  return (
    <View style={styles.footer}>
      <Pagination isWhite={true} currentIndex={currentIndex} count={count} />
    </View>
  );
};

export default memo(ChallengeCardsFooter);

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: verticalScale(50),
    alignItems: 'center',
  },
});
