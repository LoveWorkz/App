import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SceneMap} from 'react-native-tab-view';

import {TabView} from '@src/shared/ui/TabView/TabView';
import ComponentScreen from './ComponentScreen/ComponentScreen';

const FavoritesChallengesPage = () => {
  const {t} = useTranslation();

  const renderScene = useMemo(() => {
    return SceneMap({
      core: () => <ComponentScreen isCore={true} isFavortePage />,
      special: () => <ComponentScreen isFavortePage />,
    });
  }, []);

  const tabNames = useMemo(() => {
    return [
      {key: 'core', title: t('challenge.tab_core')},
      {key: 'special', title: t('challenge.tab_special')},
    ];
  }, []);

  return (
    <View style={styles.FavoritesChallengesPage}>
      <TabView renderScene={renderScene} tabNames={tabNames} />
    </View>
  );
};

export default memo(FavoritesChallengesPage);

const styles = StyleSheet.create({
  FavoritesChallengesPage: {
    flex: 1,
  },
});
