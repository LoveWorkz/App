import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {SceneMap} from 'react-native-tab-view';

import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {TabView} from '@src/shared/ui/TabView/TabView';
import challengesStore from '../model/store/challengesStore';
import ComponentScreen from './ComponentScreen/ComponentScreen';

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
  const isTabScreen = route?.params?.isTabScreen;

  useFocusEffect(
    useCallback(() => {
      // when user returns from any tab screen or BREAK page, get actual challenges data
      if (isTabScreen || prevRouteName === AppRouteNames.BREAK) {
        challengesStore.init();
      }
    }, [isTabScreen, prevRouteName]),
  );

  const renderScene = useMemo(() => {
    return SceneMap({
      core: () => <ComponentScreen isCore={true} />,
      special: () => <ComponentScreen />,
    });
  }, []);

  const tabNames = useMemo(() => {
    return [
      {key: 'core', title: t('challenge.tab_core')},
      {key: 'special', title: t('challenge.tab_special')},
    ];
  }, []);

  return (
    <View style={styles.ChallengesPage}>
      <TabView renderScene={renderScene} tabNames={tabNames} />
    </View>
  );
};

export default memo(ChallengesPage);

const styles = StyleSheet.create({
  ChallengesPage: {
    flex: 1,
  },
});
