import React, {memo, useEffect} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Loader, LoaderSize} from '@src/shared/ui/Loader/Loader';
import {HomepageBackground} from '@src/shared/assets/images';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {ComponentWrapper as CategoriesCarousel} from './CategoriesCarousel/CategoriesCarousel';
import {ComponentWrapper as Challanges} from './Challanges/Challanges';
import {ComponentWrapper as HomeCategory} from './HomeCategory/HomeCategory';
import homePageStore from '../model/store/HomePageStore';
import ProgressBar from './ProgressBar/ProgressBar';

const HomePage = () => {
  const {t} = useTranslation();

  useEffect(() => {
    homePageStore.init(t);
  }, [t]);

  if (homePageStore.isHomePageLoading) {
    return (
      <View style={styles.loader}>
        <Loader size={LoaderSize.LARGE} />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.container}>
        <ImageBackground
          resizeMode="cover"
          style={styles.homepageBackground}
          source={HomepageBackground}>
          <ProgressBar />
        </ImageBackground>
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
  homepageBackground: {
    marginTop: -globalPadding,
    marginLeft: -globalPadding,
    width: windowWidth,
    height: 310,
  },
  container: {
    flexx: 1,
    justifyContent: 'flex-start',
    height: '100%',
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
