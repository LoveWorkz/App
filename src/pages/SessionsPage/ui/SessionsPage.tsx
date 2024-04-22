import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {SessionOverview, sessionStore} from '@src/entities/Session';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {globalPadding} from '@src/app/styles/GlobalStyle';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {categoryStore, CategoryType} from '@src/entities/Category';
import sessionsPageStore from '../modal/store/SessionsPageStore';

interface SessionsPageProps {
  route?: {params: {prevRouteName: AppRouteNames | TabRoutesNames}};
}

const SessionsPage = (props: SessionsPageProps) => {
  const {route} = props;
  const levels = categoriesStore.categories;
  const currentLevel = categoryStore.category;
  const quadrantList = sessionStore.quadrants;
  const isLoading = sessionStore.isFetching;


  const onCategorySwipeHandlerHandler = useCallback((level: CategoryType) => {
    sessionStore.levelSwipeHandler(level);
  }, []);

  const isPreviousScreenQuestions =
    route?.params?.prevRouteName === AppRouteNames.QUESTIONS;

  useFocusEffect(
    useCallback(() => {
      // if the user returns from the questions get the actual data
      if (isPreviousScreenQuestions) {
        sessionsPageStore.init();
      }
    }, [isPreviousScreenQuestions]),
  );

  useEffect(() => {
    sessionsPageStore.init();
  }, []);

  if (!currentLevel) {
    return <></>;
  }

  return (
    <View style={styles.SessionsPage}>
      <SessionOverview
        isLoading={isLoading}
        quadrantList={quadrantList}
        swipeHandler={onCategorySwipeHandlerHandler}
        levels={levels}
        currentLevel={currentLevel}
      />
    </View>
  );
};

export default memo(observer(SessionsPage));

const styles = StyleSheet.create({
  SessionsPage: {
    flex: 1,
    marginTop: -globalPadding,
  },
});
