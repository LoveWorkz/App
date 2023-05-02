import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';
import {useHeaderHeight} from '@react-navigation/elements';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import {
  HomepageBackground,
  HomepageBackgroundDark,
} from '@src/shared/assets/images';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {isPlatformIos} from '@src/shared/consts/common';
import {LoaderWrapper} from '@src/shared/ui/LoaderWrapper/LoaderWrapper';
import {Quotes} from '@src/widgets/Quotes';
import {verticalScale} from '@src/shared/lib/Metrics';
import {booksStore} from '@src/pages/BooksPage';
import {ComponentWrapper as CategoriesCarousel} from './CategoriesCarousel/CategoriesCarousel';
import {ComponentWrapper as Challanges} from './Challanges/Challanges';
import {ComponentWrapper as HomeCategory} from './HomeCategory/HomeCategory';
import homePageStore from '../model/store/HomePageStore';
import ProgressBar from './ProgressBar/ProgressBar';

const HomePage = () => {
  const {theme} = useTheme();
  const navbarHeaderHeight = useHeaderHeight();
  const statusBarHeight = getStatusBarHeight();

  useEffect(() => {
    homePageStore.init();
  }, []);

  return (
    <LoaderWrapper isLoading={homePageStore.isHomePageLoading}>
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
        <Quotes books={booksStore.booksList} />
      </View>
    </LoaderWrapper>
  );
};

export const ComponentWrapper = memo(observer(HomePage));

const styles = StyleSheet.create({
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
    marginTop: verticalScale(6),
  },
  categoriesCarouselWrappeer: {
    marginTop: 25,
  },
  challangesWrapper: {
    marginTop: 40,
    width: '100%',
  },
});
