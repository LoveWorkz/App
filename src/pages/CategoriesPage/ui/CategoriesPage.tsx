import {View, StyleSheet} from 'react-native';
import React, {memo, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {Favourites} from '@src/widgets/Favourites';
import {verticalScale} from '@src/shared/lib/Metrics';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {favoriteStore} from '@src/entities/Favorite';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import Categories from './Categories/Categories';
import Rubrics from './Rubrics/Rubrics';
import categoriesStore from '../model/store/categoriesStore';

interface CategoriesPageProps {
  route?: {params: {prevRouteName: AppRouteNames | TabRoutesNames}};
}

const CategoriesPage = (props: CategoriesPageProps) => {
  const {route} = props;
  const favorites = favoriteStore.favorites;
  const isPreviousScreenSessions =
    route?.params?.prevRouteName === AppRouteNames.SESSIONS;
  const isPreviousScreenChallenges =
    route?.params?.prevRouteName === TabRoutesNames.CHALLENGES;
  const isLoading = categoriesStore.isCategoriesPageLoading;

  useFocusEffect(
    useCallback(() => {
      // if the user returns from the sessions or challenges page, get the actual data
      if (isPreviousScreenSessions || isPreviousScreenChallenges) {
        categoriesStore.init();
      }
    }, [isPreviousScreenSessions, isPreviousScreenChallenges]),
  );

  useEffect(() => {
    categoriesStore.init();
  }, []);

  return (
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
