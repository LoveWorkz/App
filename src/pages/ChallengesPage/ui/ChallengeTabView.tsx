import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SceneMap} from 'react-native-tab-view';
import {observer} from 'mobx-react-lite';

import {TabView} from '@src/shared/ui/TabView/TabView';
import challengesStore from '../model/store/challengesStore';
import ComponentScreen from './ComponentScreen/ComponentScreen';

interface ChallengesPageProps {
  isFavortePage?: boolean;
}

const ChallengeTabView = (props: ChallengesPageProps) => {
  const {isFavortePage = false} = props;

  const {t} = useTranslation();

  const renderScene = useMemo(() => {
    if (isFavortePage) {
      return SceneMap({
        // eslint-disable-next-line react/no-unstable-nested-components
        core: () => <ComponentScreen isCore={true} isFavortePage />,
        // eslint-disable-next-line react/no-unstable-nested-components
        special: () => <ComponentScreen isFavortePage />,
      });
    }

    return SceneMap({
      // eslint-disable-next-line react/no-unstable-nested-components
      core: () => <ComponentScreen isCore={true} />,
      // eslint-disable-next-line react/no-unstable-nested-components
      special: () => <ComponentScreen />,
    });
  }, [isFavortePage]);

  const tabNames = useMemo(() => {
    return [
      {key: 'core', title: t('challenge.tab_core')},
      {key: 'special', title: t('challenge.tab_special')},
    ];
  }, [t]);

  const onIndexChange = (index: number) => {
    setTimeout(() => {
      challengesStore.setChallengeTabIndex(index);
    }, 400);
  };

  return (
    <View style={styles.ChallengeTabView}>
      <TabView
        renderScene={renderScene}
        tabNames={tabNames}
        index={challengesStore.challengeTabIndex}
        setIndex={onIndexChange}
      />
    </View>
  );
};

export default memo(observer(ChallengeTabView));

const styles = StyleSheet.create({
  ChallengeTabView: {
    flex: 1,
  },
});
