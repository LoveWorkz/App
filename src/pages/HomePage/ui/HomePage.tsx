import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {profileStore} from '@src/entities/Profile';
import {Loader, LoaderSize} from '@src/shared/ui/Loader/Loader';
import {isPlatformIos} from '@src/shared/consts/common';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {ComponentWrapper as CategoriesCarousel} from './CategoriesCarousel/CategoriesCarousel';
import {ComponentWrapper as Challanges} from './Challanges/Challanges';
import {ComponentWrapper as HomeCategory} from './HomeCategory/HomeCategory';

const HomePage = () => {
  useEffect(() => {
    profileStore.fetchProfile();
    categoriesStore.fetchCategories();
  }, []);

  if (profileStore.initialFetching) {
    return (
      <View style={styles.loader}>
        <Loader size={LoaderSize.LARGE} />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.homeCategoryWrapper}>
          <HomeCategory />
        </View>
        <View style={styles.categoriesCarouselWrappeer}>
          <CategoriesCarousel />
        </View>
        <View style={styles.challangesWrapper}>
          <Challanges />
        </View>
      </View>
    </View>
  );
};

export const ComponentWrapper = memo(observer(HomePage));

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexx: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    paddingTop: !isPlatformIos ? 0 : 40,
  },
  confirmEmail: {
    marginTop: 10,
  },
  homeCategoryWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoriesCarouselWrappeer: {
    marginTop: 25,
  },
  challangesWrapper: {
    marginTop: 20,
    width: '100%',
  },
});
