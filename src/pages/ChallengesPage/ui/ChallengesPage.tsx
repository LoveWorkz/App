import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {verticalScale} from '@src/shared/lib/Metrics';
import {rubricFilterItemStore} from '@src/entities/RubricFilterItem';
import {challengeFilterItems, ChallengesList} from '@src/entities/Challenge';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import ChallengeCategories from './ChallengeCategories/ChallengeCategories';
import ChallengesFilterItems from './ChallengesFilterItems/ChallengesFilterItems';
import challengesStore from '../model/store/challengesStore';

interface ChallengesPageProps {
  route?: {
    params: {
      id: string;
      prevRouteName: AppRouteNames | TabRoutesNames;
      challenge: string;
    };
  };
}

const ChallengesPage = (props: ChallengesPageProps) => {
  const {route} = props;
  const defaultChallengeId = route?.params?.id;
  const prevRouteName = route?.params?.prevRouteName;
  const isLoading = challengesStore.isChallengePageLoading;
  const challanges = challengesStore.challenges;
  const isChallengesLoading = challengesStore.isChallengesLoading;

  useEffect(() => {
    challengesStore.init();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (prevRouteName === AppRouteNames.SETTINGS) {
        return;
      }

      rubricFilterItemStore.setRubricFilterItems(challengeFilterItems);
      challengesStore.clearChallengesInfo();
    }, [prevRouteName]),
  );

  return (
    <View style={styles.container}>
      <ChallengeCategories
        isLoading={isLoading}
        defaultChallengeId={defaultChallengeId}
      />
      <View style={styles.FilterItemsWrapper}>
        <ChallengesFilterItems isLoading={isLoading} />
      </View>
      <ChallengesList
        challengesList={challanges}
        isChallengesLoading={isChallengesLoading}
        isLoading={isLoading}
      />
    </View>
  );
};

export default memo(observer(ChallengesPage));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  FilterItemsWrapper: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
});
