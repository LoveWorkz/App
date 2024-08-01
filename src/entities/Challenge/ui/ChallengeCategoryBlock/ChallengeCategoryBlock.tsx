import React, {memo, useMemo} from 'react';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {PillContainer} from '@src/shared/ui/PillContainer/PillContainer';

interface ChallengeCategoryBlockProps {
  text: string;
}

const ChallengeCategoryBlock = (props: ChallengeCategoryBlockProps) => {
  const {text} = props;

  const colors = useColors();

  const textStyle = useMemo(() => {
    return {color: colors.white};
  }, [colors.white]);

  return (
    <PillContainer>
      <AppText
        style={textStyle}
        weight={'500'}
        size={TextSize.LEVEL_2}
        text={text}
      />
    </PillContainer>
  );
};

export default memo(ChallengeCategoryBlock);
