import {View, StyleSheet} from 'react-native';
import React, {memo, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {Favourites} from '@src/widgets/Favourites';
import {verticalScale} from '@src/shared/lib/Metrics';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {WithInAppPurchase} from '@src/widgets/WithInAppPurchase';
import {favoriteStore} from '@src/entities/Favorite';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import Categories from './Categories/Categories';
import Rubrics from './Rubrics/Rubrics';
import categoriesStore from '../model/store/categoriesStore';

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
  const favorites = favoriteStore.favorites;

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
    <WithInAppPurchase>
      <View style={styles.container}>
        {!!(favorites && favorites.questions.length) && (
          <View style={styles.favouritesWrapper}>
            <Favourites isLoading={isLoading} />
          </View>
        )}
        <Categories isLoading={isLoading} />
        <View style={styles.rubricsWrapper}>
          <Rubrics isLoading={isLoading} />
        </View>
      </View>
    </WithInAppPurchase>
  );
};

export default memo(observer(CategoriesPage));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  favouritesWrapper: {
    marginBottom: verticalScale(37),
  },
  rubricsWrapper: {
    marginTop: verticalScale(40),
  },
});
