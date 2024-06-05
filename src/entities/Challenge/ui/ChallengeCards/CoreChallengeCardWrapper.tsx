import React, {memo} from 'react';
import {observer} from 'mobx-react-lite';

import {DisplayText} from '@src/shared/types/types';
import {CaptureComponent} from '@src/shared/ui/CaptureComponent/CaptureComponent';
import challengeStore from '../../model/store/challengeStore';
import CoreChallengeCard from './CoreChallengeCard';

interface CoreChallengeIntroCardWrapperProps {
  description: DisplayText;
  groupName: string;
  groupId: string;
  id: string;
  isSessionFlow: boolean;
  isChallengeCompleted?: boolean;
}

const CoreChallengeIntroCardWrapper = (
  props: CoreChallengeIntroCardWrapperProps,
) => {
  const {id} = props;
  const chosenChallengeId = challengeStore.coreChallenge?.id;
  const isChosenChallenge = id === chosenChallengeId;

  const captureHandler = (uri: string) => {
    challengeStore.setCoreChallengeCardScreenshot(uri);
  };

  return isChosenChallenge ? (
    <CaptureComponent captureHandler={captureHandler}>
      <CoreChallengeCard {...props} />
    </CaptureComponent>
  ) : (
    <CoreChallengeCard {...props} />
  );
};

export default memo(observer(CoreChallengeIntroCardWrapper));
