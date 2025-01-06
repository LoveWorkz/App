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
    <View>
      <Pagination isWhite={!isDark} currentIndex={currentIndex} count={count} />
    </View>
  );
};

export default memo(ChallengeCardsFooter);
