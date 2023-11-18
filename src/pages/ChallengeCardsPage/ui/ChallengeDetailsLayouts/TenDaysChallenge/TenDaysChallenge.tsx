import React, {memo, useCallback} from 'react';

import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import challengeCardsPageStore from '../../../model/store/challengeCardsPageStore';
import TenDaysChallengeContent from './TenDaysChallengeContent';

interface TenDaysChallengeProps {
  challengeCardsData: any[];
}

export const TenDaysChallenge = (props: TenDaysChallengeProps) => {
  const {challengeCardsData} = props;

  const onSwipeHandler = useCallback((data: {categoryBlock: string}) => {
    challengeCardsPageStore.setCurrenctCategoryBlock(data.categoryBlock);
  }, []);

  return (
    <HorizontalSlide
      onSwipeHandler={onSwipeHandler}
      data={challengeCardsData}
      Component={TenDaysChallengeContent}
    />
  );
};

export default memo(TenDaysChallenge);
