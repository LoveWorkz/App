import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import {useHeaderHeight} from '@react-navigation/elements';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import {Loader, LoaderSize} from '@src/shared/ui/Loader/Loader';
import {
  HomepageBackground,
  HomepageBackgroundDark,
} from '@src/shared/assets/images';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {isPlatformIos} from '@src/shared/consts/common';
import {ComponentWrapper as CategoriesCarousel} from './CategoriesCarousel/CategoriesCarousel';
import {ComponentWrapper as Challanges} from './Challanges/Challanges';
import {ComponentWrapper as HomeCategory} from './HomeCategory/HomeCategory';
import homePageStore from '../model/store/HomePageStore';
import ProgressBar from './ProgressBar/ProgressBar';

const HomePage = () => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const navbarHeaderHeight = useHeaderHeight();
  const statusBarHeight = getStatusBarHeight();

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
        <FastImage
          style={[
            styles.homepageBackground,
            {
              marginTop: isPlatformIos
                ? -(navbarHeaderHeight - statusBarHeight)
                : -navbarHeaderHeight,
              paddingTop: isPlatformIos
                ? navbarHeaderHeight - statusBarHeight
                : navbarHeaderHeight,
            },
          ]}
          source={
            theme === Theme.Dark ? HomepageBackgroundDark : HomepageBackground
          }>
          <ProgressBar />
        </FastImage>
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
