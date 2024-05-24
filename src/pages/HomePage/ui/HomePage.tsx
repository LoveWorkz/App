import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';

import {
  HomepageBackground,
  HomepageBackgroundDark,
} from '@src/shared/assets/images';
import {
  globalPadding,
  windowWidth,
  windowWidthMinusPaddings,
} from '@src/app/styles/GlobalStyle';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {HEADER_HEIGHT} from '@src/shared/consts/common';
import {Quotes} from '@src/widgets/Quotes';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {
  homepageBackgroundImgHeight,
  HomePageHeader,
} from '@src/widgets/headers/HomePageHeader';
import {DiscountOfferCard} from '@src/features/InAppPurchase';
import ScrollViewWithoutIndicator from '@src/shared/ui/ScrollViewWithoutIndicator/ScrollViewWithoutIndicator';
import CategoriesCarousel from './CategoriesCarousel/CategoriesCarousel';
import Challanges from './Challanges/Challanges';
import QuickStart from './QuickStart/QuickStart';
import homePageStore from '../model/store/HomePageStore';
import ProgressBar from './ProgressBar/ProgressBar';

interface HomePageProps {
  route?: {
    params: {
      prevRouteName: AppRouteNames | TabRoutesNames;
      isTabScreen: boolean;
    };
  };
}

const contentTop = -150;
const skeletonContentTop = -20;

const HomePage = (props: HomePageProps) => {
  const {route} = props;

  const {theme} = useTheme();
  const {i18n} = useTranslation();

  const language = i18n.language as LanguageValueType;
  const prevRouteName = route?.params?.prevRouteName;
  const isTabScreen = route?.params?.isTabScreen;
  const isLoading = homePageStore.isHomePageLoading;

  useFocusEffect(
    useCallback(() => {
      // when user returns from any tab screen or question page, get actual challenges and categories data
      if (
        isTabScreen ||
        prevRouteName === AppRouteNames.QUESTIONS ||
        prevRouteName === AppRouteNames.SESSIONS
      ) {
        homePageStore.fetchHomePageCategoriesAndChallenges(language);
      }
    }, [language, isTabScreen, prevRouteName]),
  );

  useEffect(() => {
    homePageStore.init(language);
  }, [language]);

  return (
    <View
      style={[
        styles.HomePage,
        {marginBottom: isLoading ? 0 : horizontalScale(-HEADER_HEIGHT)},
      ]}>
      <HomePageHeader isLoading={isLoading} />
      <ScrollViewWithoutIndicator>
        <View
          style={[
            styles.container,
            {
              top: isLoading
                ? horizontalScale(10)
                : horizontalScale(-HEADER_HEIGHT),
            },
          ]}>
          {isLoading ? (
            <View style={styles.progressBarSkeleton}>
              <Skeleton
                width={windowWidthMinusPaddings}
                height={horizontalScale(250)}
              />
            </View>
          ) : (
            <FastImage
              style={[styles.homepageBackground]}
              source={
                theme === Theme.Dark
                  ? HomepageBackgroundDark
                  : HomepageBackground
              }>
              <ProgressBar />
            </FastImage>
          )}
          <View
            style={[
              styles.content,
              {
                top: isLoading ? skeletonContentTop : contentTop,
                marginBottom: isLoading ? skeletonContentTop : contentTop,
              },
            ]}>
            <View style={styles.homeCategoryWrapper}>
              <QuickStart isLoading={isLoading} />
            </View>
            <View style={styles.discountOfferCardWrapper}>
              <DiscountOfferCard isLoading={isLoading} />
            </View>
            <CategoriesCarousel isLoading={isLoading} />
            <View style={styles.challangesWrapper}>
              <Challanges isLoading={isLoading} />
            </View>
          </View>
          <Quotes />
        </View>
      </ScrollViewWithoutIndicator>
    </View>
  );
};

export default memo(observer(HomePage));

const styles = StyleSheet.create({
  HomePage: {
    flex: 1,
    marginLeft: -globalPadding,
    width: windowWidth,
  },
  homepageBackground: {
    height: horizontalScale(homepageBackgroundImgHeight),
    paddingTop: horizontalScale(HEADER_HEIGHT),
  },
  container: {
    width: windowWidth,
    alignItems: 'center',
  },
  content: {
    width: windowWidth,
    paddingHorizontal: globalPadding,
  },
  homeCategoryWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: horizontalScale(20),
  },
  challangesWrapper: {
    marginTop: horizontalScale(10),
    width: '100%',
  },
  discountOfferCardWrapper: {
    alignItems: 'center',
    marginBottom: horizontalScale(25),
  },

  progressBarSkeleton: {
    marginBottom: horizontalScale(30),
  },
});
