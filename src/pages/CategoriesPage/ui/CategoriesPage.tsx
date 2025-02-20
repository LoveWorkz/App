import {View, StyleSheet} from 'react-native';
import React, {memo, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import Categories from './Categories/Categories';
import categoriesStore from '../model/store/categoriesStore';
import FavoriteSessions from './Favorites/Favorites';

interface CategoriesPageProps {
  route?: {
    params: {
      prevRouteName: AppRouteNames | TabRoutesNames;
      isTabScreen: boolean;
    };
  };
}

const CategoriesPage = (props: CategoriesPageProps) => {
  const {route} = props;

  const isPreviousScreenSessions =
    route?.params?.prevRouteName === AppRouteNames.SESSIONS;
  const isPreviousScreenQuestions =
    route?.params?.prevRouteName === AppRouteNames.QUESTIONS;

  const isTabScreen = route?.params?.isTabScreen;

  const isLoading = categoriesStore.isCategoriesPageLoading;

  useFocusEffect(
    useCallback(() => {
      // if the user returns from the sessions, questions or tab screens, get the actual data
      if (
        isPreviousScreenSessions ||
        isPreviousScreenQuestions ||
        isTabScreen
      ) {
        categoriesStore.init();
      }
    }, [isPreviousScreenSessions, isPreviousScreenQuestions, isTabScreen]),
  );

  useEffect(() => {
    categoriesStore.init();
  }, []);

  return (
    <View style={styles.container}>
      <FavoriteSessions />
      <Categories isLoading={isLoading} />
    </View>
  );
};

export default memo(observer(CategoriesPage));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
