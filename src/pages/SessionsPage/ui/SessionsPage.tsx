import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {QuadrantList} from '@src/entities/Session';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {globalPadding} from '@src/app/styles/GlobalStyle';
import {categoriesStore} from '@src/pages/CategoriesPage';
import { verticalScale } from '@src/shared/lib/Metrics';
import sessionsPageStore from '../modal/store/SessionsPageStore';
import HeaderSection from './HeaderSection/HeaderSection';

interface SessionsPageProps {
  route?: {params: {prevRouteName: AppRouteNames | TabRoutesNames}};
}

const SessionsPage = (props: SessionsPageProps) => {
  const {route} = props;
  const isFetching = sessionsPageStore.isFetching;
  const categories = categoriesStore.categories;

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

  return (
    <View style={styles.SessionsPage}>
      <HeaderSection categories={categories} />
      <View style={styles.quadrantList}>
        <QuadrantList isFetching={isFetching} />
      </View>
    </View>
  );
};

export default memo(observer(SessionsPage));

const styles = StyleSheet.create({
  SessionsPage: {
    flex: 1,
    marginTop: -globalPadding,
  },
  quadrantList: {
    marginTop: verticalScale(40)
  }
});
