import {View, StyleSheet} from 'react-native';
import React, {memo, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {Favourites} from '@src/widgets/Favourites';
import {verticalScale} from '@src/shared/lib/Metrics';
import {LoaderWrapper} from '@src/shared/ui/LoaderWrapper/LoaderWrapper';
import {favoriteStore} from '@src/entities/Favorite';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import Categories from './Categories/Categories';
import Rubrics from './Rubrics/Rubrics';
import categoriesStore from '../model/store/categoriesStore';

interface CategoriesPageProps {
  route?: {params: {prevRouteName: AppRouteNames}};
}

const CategoriesPage = (props: CategoriesPageProps) => {
  const {route} = props;
  const favorites = favoriteStore.favorites;
  const isPreviousScreenQuestions =
    route?.params?.prevRouteName === AppRouteNames.QUESTIONS;

  useFocusEffect(
    useCallback(() => {
      // if the user returns from the questions page, get the actual data
      if (isPreviousScreenQuestions) {
        categoriesStore.init();
      }
    }, [isPreviousScreenQuestions]),
  );

  useEffect(() => {
    categoriesStore.init();
  }, []);

  return (
    <LoaderWrapper isLoading={categoriesStore.isCategoriesPageLoading}>
      <View style={styles.container}>
        {!!(favorites && favorites.questions.length) && (
          <View style={styles.favouritesWrapper}>
            <Favourites />
          </View>
        )}
        <Categories />
        <View style={styles.rubricsWrapper}>
          <Rubrics />
        </View>
      </View>
    </LoaderWrapper>
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
