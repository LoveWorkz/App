import React, {memo, useCallback} from 'react';

import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import {SpecialChallengeType} from '@src/entities/Challenge';
import SelfReflectionContent from './SelfReflectionContent';
import challengeCardsPageStore from '../../../model/store/ChallengeCardsPageStore';

interface SelfReflectionProps {
  specialChallenge: SpecialChallengeType;
  challengeCardsData: any[];
}

export const SelfReflection = (props: SelfReflectionProps) => {
  const {challengeCardsData} = props;

  const onSwipeHandler = useCallback((data: any) => {
    challengeCardsPageStore.setCurrenctCategoryBlock(data.categoryBlock);
  }, []);

  return (
    <HorizontalSlide
      onSwipeHandler={onSwipeHandler}
      data={challengeCardsData}
      Component={SelfReflectionContent}
    />
  );
};

export default memo(SelfReflection);
