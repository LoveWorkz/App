import React, {memo, useCallback} from 'react';

import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import VocabularyOfFeelContent from './VocabularyOfFeelContent';
import challengeCardsPageStore from '../../../model/store/challengeCardsPageStore';

interface VocabularyOfFeelProps {
  challengeCardsData: any[];
}

export const VocabularyOfFeel = (props: VocabularyOfFeelProps) => {
  const {challengeCardsData} = props;

  const onSwipeHandler = useCallback((data: any) => {
    challengeCardsPageStore.setCurrenctCategoryBlock(data.categoryBlock);
  }, []);

  return (
    <HorizontalSlide
      onSwipeHandler={onSwipeHandler}
      data={challengeCardsData}
      Component={VocabularyOfFeelContent}
    />
  );
};

export default memo(VocabularyOfFeel);
