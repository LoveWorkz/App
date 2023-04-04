import React, {memo, useEffect} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {observer} from 'mobx-react-lite';

import {profileStore} from '@src/entities/Profile';
import {Loader, LoaderSize} from '@src/shared/ui/Loader/Loader';
import {isPlatformIos} from '@src/shared/consts/common';
import {ComponentWrapper as CategoriesCarousel} from './CategoriesCarousel/CategoriesCarousel';
import {ComponentWrapper as Challanges} from './Challanges/Challanges';
import {ComponentWrapper as HomeCategory} from './HomeCategory/HomeCategory';
import {ComponentWrapper as Header} from './Header/Header';

const HomePage = () => {
  useEffect(() => {
    profileStore.fetchProfile();
  }, []);

  if (profileStore.initialFetching) {
    return (
      <View style={styles.loader}>
        <Loader size={LoaderSize.LARGE} />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <Header
            name={profileStore.profileData?.name || ''}
            imageUrl={profileStore.avatar || ''}
          />
        </View>
        <View style={styles.homeCategoryWrapper}>
          <HomeCategory />
        </View>
        <CategoriesCarousel />
        <View style={styles.challangesWrapper}>
          <Challanges />
        </View>
      </View>
    </ScrollView>
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
  headerWrapper: {
    marginBottom: 20,
  },
  confirmEmail: {
    marginTop: 10,
  },
  homeCategoryWrapper: {
    width: '100%',
    marginBottom: 10,
  },
  challangesWrapper: {
    marginTop: 10,
    width: '100%',
  },
});
