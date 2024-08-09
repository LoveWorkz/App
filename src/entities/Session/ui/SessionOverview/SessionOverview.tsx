import React, {memo} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';

import {verticalScale} from '@src/shared/lib/Metrics';
import {CategoryType} from '@src/entities/Category';
import HeaderSection from './HeaderSection/HeaderSection';
import {QuadrantType} from '../../model/types/sessionType';
import QuadrantList from '../QuadrantList/QuadrantList';
import {useTheme} from '@src/app/providers/themeProvider';

interface SessionOverviewProps {
  levels: CategoryType[];
  currentLevel: CategoryType;
  swipeHandler: (level: CategoryType) => void;
  quadrantList: QuadrantType[];
  isFavorite?: boolean;
  isLoading?: boolean;
}

const SessionOverview = (props: SessionOverviewProps) => {
  const {
    isFavorite = false,
    levels,
    currentLevel,
    swipeHandler,
    quadrantList,
    isLoading = false,
  } = props;

  const {isDark} = useTheme();

  return (
    <View style={styles.SessionOverview}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <HeaderSection
        swipeHandler={swipeHandler}
        isFavorite={isFavorite}
        levels={levels}
        currentLevel={currentLevel}
      />
      <View style={styles.quadrantList}>
        <QuadrantList
          allSessionsCount={currentLevel.allSessionsCount}
          quadrantList={quadrantList}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

export default memo(SessionOverview);

const styles = StyleSheet.create({
  SessionOverview: {
    flex: 1,
  },
  quadrantList: {
    marginTop: verticalScale(40),
  },
});
