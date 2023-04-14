import {View, StyleSheet} from 'react-native';
import React, {memo, useEffect} from 'react';

import {Favourites} from '@src/widgets/Favourites';
import {profileStore} from '@src/entities/Profile';
import {Loader, LoaderSize} from '@src/shared/ui/Loader/Loader';
import Categories from './Categories/Categories';
import Rubrics from './Rubrics/Rubrics';
import categoriesStore from '../model/store/categoriesStore';

const CategoriesPage = () => {
  useEffect(() => {
    profileStore.fetchProfile();
    categoriesStore.fetchCategories();
  }, []);

  if (!categoriesStore.categories) {
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
      <Favourites />
      <View style={styles.categoryWrapper}>
        <Categories />
      </View>
      <View style={styles.rubricsWrapper}>
        <Rubrics />
      </View>
    </View>
  );
};

export default memo(CategoriesPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryWrapper: {
    marginTop: 37,
  },
  rubricsWrapper: {
    marginTop: 40,
  },

  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
