import React, {memo, useCallback} from 'react';

import {ChallengeCardsFooter} from '@src/entities/Challenge';
import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import {CARD_WIDTH} from '@src/shared/consts/common';
import challengeCardsPageStore from '../../../model/store/challengeCardsPageStore';
import EffectiveApologiesContent from './EffectiveApologiesContent';

export const EffectiveApologies = () => {
  const onSwipeHandler = useCallback((data: {categoryBlock: string}) => {
    challengeCardsPageStore.setCurrenctCategoryBlock(data.categoryBlock);
  }, []);

  return (
    <HorizontalSlide
      onSwipeHandler={onSwipeHandler}
      data={[{id: 1}, {id: 2}, {id: 4}, {id: 5}, {id: 6}]}
      Component={EffectiveApologiesContent}
      isSlideEnabled
      itemWidth={CARD_WIDTH}
      Footer={ChallengeCardsFooter}
      showLength={4}
      opacityInterval={0.3}
    />
  );
};

export default memo(EffectiveApologies);
