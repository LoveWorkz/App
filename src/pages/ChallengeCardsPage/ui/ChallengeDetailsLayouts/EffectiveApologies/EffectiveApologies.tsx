import React, {memo, useCallback} from 'react';

import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import challengeCardsPageStore from '../../../model/store/challengeCardsPageStore';
import EffectiveApologiesContent from './EffectiveApologiesContent';

interface EffectiveApologiesProps {
  challengeCardsData: any[];
}

export const EffectiveApologies = (props: EffectiveApologiesProps) => {
  const {challengeCardsData} = props;

  const onSwipeHandler = useCallback((data: {categoryBlock: string}) => {
    challengeCardsPageStore.setCurrenctCategoryBlock(data.categoryBlock);
  }, []);

  return (
    <HorizontalSlide
      onSwipeHandler={onSwipeHandler}
      data={challengeCardsData}
      Component={EffectiveApologiesContent}
    />
  );
};

export default memo(EffectiveApologies);
