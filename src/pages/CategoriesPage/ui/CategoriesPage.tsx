import {View, StyleSheet} from 'react-native';
import React, {memo, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {Favourites} from '@src/widgets/Favourites';
import {verticalScale} from '@src/shared/lib/Metrics';
import {LoaderWrapper} from '@src/shared/ui/LoaderWrapper/LoaderWrapper';
import {favoriteStore} from '@src/entities/Favorite';
import Categories from './Categories/Categories';
import Rubrics from './Rubrics/Rubrics';
import categoriesStore from '../model/store/categoriesStore';

const CategoriesPage = () => {
  const favorites = favoriteStore.favorite;

  useFocusEffect(
    useCallback(() => {
      categoriesStore.init();
    }, []),
  );

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
