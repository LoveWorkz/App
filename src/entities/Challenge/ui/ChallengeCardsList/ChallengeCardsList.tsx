import React, {memo, useCallback, useMemo} from 'react';
import {observer} from 'mobx-react-lite';

import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import {challengeCard1} from '@src/shared/assets/images';
import ChallengeCard from '../ChallengeCard/ChallengeCard';

export const ChallengeCardsList = () => {
  const onSwipeHandler = useCallback(() => {}, []);

  const data = useMemo(() => {
    return [
      {id: 'id_!', image: challengeCard1},
      {id: 'id_2', image: challengeCard1},
    ];
  }, []);

  return (
    <HorizontalSlide
      onSwipeHandler={onSwipeHandler}
      data={data}
      Component={ChallengeCard}
    />
  );
};

export default memo(observer(ChallengeCardsList));
