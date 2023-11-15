import React, {memo} from 'react';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

export const VocabularyOfFeelContent = () => {
  return (
    <>
      <AppText
        weight={'700'}
        size={TextSize.LEVEL_5}
        text={'VocabularyOfFeelContent'}
      />
    </>
  );
};

export default memo(VocabularyOfFeelContent);
