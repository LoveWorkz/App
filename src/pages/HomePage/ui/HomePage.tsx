import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';
import {useHeaderHeight} from '@react-navigation/elements';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';

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
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {profileStore} from '@src/entities/Profile';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {ComponentWrapper as CategoriesCarousel} from './CategoriesCarousel/CategoriesCarousel';
import {ComponentWrapper as Challanges} from './Challanges/Challanges';
import {ComponentWrapper as HomeCategory} from './HomeCategory/HomeCategory';
import homePageStore from '../model/store/HomePageStore';
import ProgressBar from './ProgressBar/ProgressBar';

interface HomePageProps {
  route?: {params: {prevRouteName: AppRouteNames | TabRoutesNames}};
}

const HomePage = (props: HomePageProps) => {
  const {route} = props;
  const {theme} = useTheme();
  const navbarHeaderHeight = useHeaderHeight();
  const statusBarHeight = getStatusBarHeight();
  const {i18n} = useTranslation();
  const language = i18n.language as LanguageValueType;
  const prevRouteName = route?.params?.prevRouteName;

  // if user swipe question first time show home page quick start
  const hasUserSwipedAnyQuestion =
    profileStore.profileData?.hasUserSwipedAnyQuestion;

  useFocusEffect(
    useCallback(() => {
      // if the user returns from the questions page, get the actual categories data
      if (
        prevRouteName === AppRouteNames.QUESTIONS ||
        prevRouteName === TabRoutesNames.CATEGORIES
      ) {
        homePageStore.fetchHomePageCategoryies(language);
      }

      // if the user returns from the Challenges page, get the actual Challenges data
      if (prevRouteName === TabRoutesNames.CHALLENGES) {
        homePageStore.fetchHomePageCategoryChallenges();
      }
    }, [prevRouteName, language]),
  );

  useEffect(() => {
    homePageStore.init(language);
  }, [language]);

  return (
    <LoaderWrapper isLoading={homePageStore.isHomePageLoading}>
      <View style={styles.container}>
        <FastImage
          style={[
            styles.homepageBackground,
            {
              marginTop: isPlatformIos
                ? -navbarHeaderHeight
                : -navbarHeaderHeight - statusBarHeight,
              paddingTop: isPlatformIos
                ? navbarHeaderHeight
                : navbarHeaderHeight + statusBarHeight,
            },
          ]}
          source={
            theme === Theme.Dark ? HomepageBackgroundDark : HomepageBackground
          }>
          <ProgressBar />
        </FastImage>
        {hasUserSwipedAnyQuestion && (
          <View style={styles.homeCategoryWrapper}>
            <HomeCategory />
          </View>
        )}
        <CategoriesCarousel />
        <View style={styles.challangesWrapper}>
          <Challanges />
        </View>
        <Quotes />
      </View>
    </LoaderWrapper>
  );
};

export const ComponentWrapper = memo(observer(HomePage));

const styles = StyleSheet.create({
  homepageBackground: {
    marginLeft: -globalPadding,
    width: windowWidth,
    height: 365,
  },
  container: {
    flexx: 1,
    justifyContent: 'flex-start',
    height: '100%',
  },
  homeCategoryWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: verticalScale(35),
  },

  challangesWrapper: {
    marginTop: verticalScale(40),
    width: '100%',
  },
});
