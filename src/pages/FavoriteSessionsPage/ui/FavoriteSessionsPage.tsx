import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {SessionOverview, sessionStore} from '@src/entities/Session';
import {globalPadding} from '@src/app/styles/GlobalStyle';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {CategoryType} from '@src/entities/Category';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';

interface FavoriteSessionsPageProps {
  route?: {params: {prevRouteName: AppRouteNames | TabRoutesNames}};
}

const FavoriteSessionsPage = (props: FavoriteSessionsPageProps) => {
  const {route} = props;

  const levels = categoriesStore.categories;
  // if this is a favorites page, we always start from the first level
  const currentLevel = levels[0];

  const favoriteQuadrantsSessionsfavorite =
    sessionStore.favoriteQuadrantsSessions;
  const isLoading = sessionStore.isFetching;

  const isPreviousScreenQuestions =
    route?.params?.prevRouteName === AppRouteNames.QUESTIONS;

  useFocusEffect(
    useCallback(() => {
      // if the user returns from the questions get the actual data
      if (isPreviousScreenQuestions) {
        sessionStore.levelSwipeHandlerForFavorites(currentLevel);
      }
    }, [currentLevel, isPreviousScreenQuestions]),
  );

  useEffect(() => {
    sessionStore.levelSwipeHandlerForFavorites(currentLevel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCategorySwipeHandler = useCallback((level: CategoryType) => {
    sessionStore.levelSwipeHandlerForFavorites(level);
  }, []);

  if (!currentLevel) {
    return <></>;
  }

  return (
    <View style={styles.FavoriteSessionsPage}>
      <SessionOverview
        isFavorite
        quadrantList={favoriteQuadrantsSessionsfavorite}
        swipeHandler={onCategorySwipeHandler}
        levels={levels}
        currentLevel={currentLevel}
        isLoading={isLoading}
      />
    </View>
  );
};

export default memo(observer(FavoriteSessionsPage));

const styles = StyleSheet.create({
  FavoriteSessionsPage: {
    flex: 1,
    marginTop: -globalPadding,
  },
});
