import React, {memo} from 'react';

import {ChallengeCard, ChallengeIntroCard} from '@src/entities/Challenge';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

interface SelfReflectionContentProps {
  data: any;
}

export const SelfReflectionContent = (props: SelfReflectionContentProps) => {
  const {data} = props;

  let content;

  switch (data.type) {
    case 'intro':
      content = (
        <ChallengeIntroCard title={data.title} description={data.description} />
      );
      break;
    case 'data_1':
      content = (
        <ChallengeCard title={data.title}>
          <AppText weight={'400'} size={TextSize.LEVEL_3} text={data.text1} />
        </ChallengeCard>
      );
      break;
    default:
      content = (
        <ChallengeCard title={data.title}>
          <AppText weight={'400'} size={TextSize.LEVEL_3} text={''} />
        </ChallengeCard>
      );
  }

  return <>{content}</>;
};

export default memo(SelfReflectionContent);
