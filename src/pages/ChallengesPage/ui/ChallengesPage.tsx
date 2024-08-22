import React, {memo, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import challengesStore from '../model/store/challengesStore';
import ChallengeTabView from './ChallengeTabView';

interface ChallengesPageProps {
  route?: {
    params: {
      id: string;
      prevRouteName: AppRouteNames | TabRoutesNames;
      challenge: string;
      isTabScreen: boolean;
    };
  };
}

const ChallengesPage = (props: ChallengesPageProps) => {
  const {route} = props;

  const prevRouteName = route?.params?.prevRouteName;
  const isTabScreen = route?.params?.isTabScreen;

  useFocusEffect(
    useCallback(() => {
      // when user returns from any tab screen or BREAK page, get actual challenges data
      if (
        isTabScreen ||
        prevRouteName === AppRouteNames.BREAK ||
        prevRouteName === 'home'
      ) {
        challengesStore.init();
      }
    }, [isTabScreen, prevRouteName]),
  );

  return <ChallengeTabView />;
};

export default memo(ChallengesPage);
