import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import Pagination from '@src/shared/ui/HorizontalSlide/Pagination';
import {verticalScale} from '@src/shared/lib/Metrics';
import {useTheme} from '@src/app/providers/themeProvider';

interface ChallengeCardsFooterProps {
  count: number;
  currentIndex: number;
}

const ChallengeCardsFooter = (props: ChallengeCardsFooterProps) => {
  const {count, currentIndex} = props;
  const {isDark} = useTheme();

  return (
    <View style={styles.footer}>
      <Pagination isWhite={!isDark} currentIndex={currentIndex} count={count} />
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
