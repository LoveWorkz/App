import {View, StyleSheet} from 'react-native';
import React, {memo, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {Favourites} from '@src/widgets/Favourites';
import {Loader, LoaderSize} from '@src/shared/ui/Loader/Loader';
import {profileStore} from '@src/entities/Profile';
import {verticalScale} from '@src/shared/lib/Metrics';
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

  if (!categoriesStore.categories || profileStore.initialFetching) {
    return (
      <View style={styles.container}>
        <View style={styles.loader}>
          <Loader size={LoaderSize.LARGE} />
        </View>
      </View>
    );
  }

  return (
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

  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
