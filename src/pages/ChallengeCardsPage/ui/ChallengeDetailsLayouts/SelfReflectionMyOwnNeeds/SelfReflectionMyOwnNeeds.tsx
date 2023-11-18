import React, {memo, useCallback} from 'react';

import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import challengeCardsPageStore from '../../../model/store/challengeCardsPageStore';
import SelfReflectionMyOwnNeedsContent from './SelfReflectionMyOwnNeedsContent';

interface SelfReflectionMyOwnNeedsProps {
  challengeCardsData: any[];
}

export const SelfReflectionMyOwnNeeds = (
  props: SelfReflectionMyOwnNeedsProps,
) => {
  const {challengeCardsData} = props;

  const onSwipeHandler = useCallback((data: {categoryBlock: string}) => {
    challengeCardsPageStore.setCurrenctCategoryBlock(data.categoryBlock);
  }, []);

  return (
    <HorizontalSlide
      onSwipeHandler={onSwipeHandler}
      data={challengeCardsData}
      Component={SelfReflectionMyOwnNeedsContent}
    />
  );
};

export default memo(SelfReflectionMyOwnNeeds);
