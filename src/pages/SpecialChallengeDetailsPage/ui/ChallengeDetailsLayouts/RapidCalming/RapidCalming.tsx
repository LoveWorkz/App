import React, {memo, useCallback} from 'react';

import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import challengeCardsPageStore from '../../../model/store/challengeCardsPageStore';
import RapidCalmingContent from './RapidCalmingContent';

interface RapidCalmingProps {
  challengeCardsData: any[];
}

export const RapidCalming = (props: RapidCalmingProps) => {
  const {challengeCardsData} = props;

  const onSwipeHandler = useCallback((data: {categoryBlock: string}) => {
    challengeCardsPageStore.setCurrenctCategoryBlock(data.categoryBlock);
  }, []);

  return (
    <HorizontalSlide
      onSwipeHandler={onSwipeHandler}
      data={challengeCardsData}
      Component={RapidCalmingContent}
    />
  );
};

export default memo(RapidCalming);
