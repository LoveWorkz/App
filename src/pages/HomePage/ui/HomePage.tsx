import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {profileStore} from '@src/entities/Profile';
import {ComponentWrapper as Header} from './Header/Header';
import {HomeCategory} from '@src/widgets/HomeCategory';
import {Loader, LoaderSize} from '@src/shared/ui/Loader/Loader';
import {ComponentWrapper as CategoriesCarousel} from './CategoriesCarousel/CategoriesCarousel';
import {ComponentWrapper as Challanges} from './Challanges/Challanges';

const HomePage = () => {
  useFocusEffect(
    React.useCallback(() => {
      profileStore.fetchProfile();
    }, []),
  );

  if (!profileStore.profileData) {
    return (
      <View style={styles.loader}>
        <Loader size={LoaderSize.LARGE} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Header
          name={profileStore.profileData.name || ''}
          imageUrl={profileStore.profileData.photo || ''}
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
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 0,
    height: '100%',
    paddingTop: 30,
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
