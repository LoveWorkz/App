import React, {memo, useCallback} from 'react';

import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import challengeCardsPageStore from '../../../model/store/challengeCardsPageStore';
import WalkOfGratitudeContent from './WalkOfGratitudeContent';

interface WalkOfGratitudeProps {
  challengeCardsData: any[];
}

export const WalkOfGratitude = (props: WalkOfGratitudeProps) => {
  const {challengeCardsData} = props;

  const onSwipeHandler = useCallback((data: {categoryBlock: string}) => {
    challengeCardsPageStore.setCurrenctCategoryBlock(data.categoryBlock);
  }, []);

  return (
    <HorizontalSlide
      onSwipeHandler={onSwipeHandler}
      data={challengeCardsData}
      Component={WalkOfGratitudeContent}
    />
  );
};

export default memo(WalkOfGratitude);
