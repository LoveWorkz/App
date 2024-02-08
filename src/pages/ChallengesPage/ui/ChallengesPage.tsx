import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {SceneMap} from 'react-native-tab-view';

import {rubricFilterItemStore} from '@src/entities/RubricFilterItem';
import {
  challengeFilterItems,
  ChallengeType,
  CoreChallengesList,
  SpecialChallengesList,
  SpecialChallengeType,
} from '@src/entities/Challenge';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {verticalScale} from '@src/shared/lib/Metrics';
import {TabView} from '@src/shared/ui/TabView/TabView';
import ChallengeCategories from './ChallengeCategories/ChallengeCategories';
import challengesStore from '../model/store/challengesStore';

const ComponentScreen = memo(
  ({
    isChallengesLoading,
    isLoading,
    challanges,
    isCore = false,
  }: {
    isCore?: boolean;
    isLoading: boolean;
    isChallengesLoading: boolean;
    challanges: ChallengeType[] | SpecialChallengeType[];
  }) => (
    <View style={styles.ComponentScreen}>
      <ChallengeCategories isLoading={isLoading} />
      <View style={styles.line} />
      <>
        {isCore ? (
          <CoreChallengesList
            isLoading={isLoading}
            isChallengesLoading={isChallengesLoading}
            challengesList={challanges as ChallengeType[]}
          />
        ) : (
          <SpecialChallengesList
            isLoading={isLoading}
            isChallengesLoading={isChallengesLoading}
            challengesList={challanges as SpecialChallengeType[]}
          />
        )}
      </>
    </View>
  ),
);

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

  const {t} = useTranslation();

  const prevRouteName = route?.params?.prevRouteName;
  const isLoading = challengesStore.isChallengePageLoading;
  const challanges = challengesStore.challenges;
  const specialChallanges = challengesStore.specialChallenges;
  const isChallengesLoading = challengesStore.isChallengesLoading;
  const isTabScreen = route?.params?.isTabScreen;

  useFocusEffect(
    useCallback(() => {
      // when user returns from any tab screen or questions page, get actual challenges data
      if (isTabScreen || prevRouteName === AppRouteNames.QUESTIONS) {
        challengesStore.init();
      }
    }, [isTabScreen, prevRouteName]),
  );

  useFocusEffect(
    useCallback(() => {
      if (prevRouteName === AppRouteNames.SETTINGS) {
        return;
      }

      rubricFilterItemStore.setRubricFilterItems(challengeFilterItems);
      challengesStore.clearChallengesInfo();
    }, [prevRouteName]),
  );

  const renderScene = useMemo(() => {
    return SceneMap({
      core: () => (
        <ComponentScreen
          isCore={true}
          isLoading={isLoading}
          isChallengesLoading={isChallengesLoading}
          challanges={challanges}
        />
      ),
      special: () => (
        <ComponentScreen
          isLoading={isLoading}
          isChallengesLoading={isChallengesLoading}
          challanges={specialChallanges}
        />
      ),
    });
  }, [isLoading, isChallengesLoading, challanges, specialChallanges]);

  const tabNames = useMemo(() => {
    return [
      {key: 'core', title: t('challenge.tab_core')},
      {key: 'special', title: t('challenge.tab_special')},
    ];
  }, []);

  return <TabView renderScene={renderScene} tabNames={tabNames} />;
};

export default memo(observer(ChallengesPage));

const styles = StyleSheet.create({
  ComponentScreen: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: verticalScale(20),
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    marginTop: verticalScale(15),
    marginBottom: verticalScale(15),
  },
});
