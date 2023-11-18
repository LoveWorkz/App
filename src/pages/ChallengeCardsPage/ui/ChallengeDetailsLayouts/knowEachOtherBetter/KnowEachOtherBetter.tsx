import React, {memo, useCallback} from 'react';

import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import challengeCardsPageStore from '../../../model/store/challengeCardsPageStore';
import {KnowEachOtherBetterContent} from './KnowEachOtherBetterContent';

interface KnowEachOtherBetterProps {
  challengeCardsData: any[];
}

export const KnowEachOtherBetter = (props: KnowEachOtherBetterProps) => {
  const {challengeCardsData} = props;

  const onSwipeHandler = useCallback((data: {categoryBlock: string}) => {
    challengeCardsPageStore.setCurrenctCategoryBlock(data.categoryBlock);
  }, []);

  return (
    <HorizontalSlide
      onSwipeHandler={onSwipeHandler}
      data={challengeCardsData}
      Component={KnowEachOtherBetterContent}
    />
  );
};

export default memo(KnowEachOtherBetter);
