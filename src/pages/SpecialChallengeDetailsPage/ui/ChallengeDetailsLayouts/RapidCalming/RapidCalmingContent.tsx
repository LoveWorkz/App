import React, {memo} from 'react';
import {View} from 'react-native';

import {ChallengeIntroCard} from '@src/entities/Challenge';

interface RapidCalmingContentProps {
  data: any;
}

export const RapidCalmingContent = (props: RapidCalmingContentProps) => {
  const {data} = props;

  let content;

  switch (data.type) {
    case 'intro':
      content = (
        <ChallengeIntroCard title={data.title} description={data.description} />
      );
      break;
    default:
      content = <View />;
  }

  return <>{content}</>;
};

export default memo(RapidCalmingContent);
