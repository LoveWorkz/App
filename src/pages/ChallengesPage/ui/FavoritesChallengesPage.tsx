import React, {memo} from 'react';

import ChallengeTabView from './ChallengeTabView';

const FavoritesChallengesPage = () => {
  return <ChallengeTabView isFavortePage />;
};

export default memo(FavoritesChallengesPage);
