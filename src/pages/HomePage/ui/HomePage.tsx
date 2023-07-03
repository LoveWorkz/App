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
import {
  globalPadding,
  windowWidth,
  windowWidthMinusPaddings,
} from '@src/app/styles/GlobalStyle';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {isPlatformIos} from '@src/shared/consts/common';
import {Quotes} from '@src/widgets/Quotes';
import {verticalScale} from '@src/shared/lib/Metrics';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {userStore} from '@src/entities/User';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
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

const HomePage = (props: HomePageProps) => {
  const {route} = props;
  const {theme} = useTheme();
  const navbarHeaderHeight = useHeaderHeight();
  const statusBarHeight = getStatusBarHeight();
  const {i18n} = useTranslation();
  const language = i18n.language as LanguageValueType;
  const prevRouteName = route?.params?.prevRouteName;
  const isTabScreen = route?.params?.isTabScreen;
  const isLoading = homePageStore.isHomePageLoading;

  // if user swipe question first time show home page quick start
  const hasUserSwipedAnyQuestion = userStore.user?.hasUserSwipedAnyQuestion;

  useFocusEffect(
    useCallback(() => {
      // when user returns from any tab screen or question page, get actual challenges and categories data
      if (isTabScreen || prevRouteName === AppRouteNames.QUESTIONS) {
        homePageStore.fetchHomePageCategoriesAndChallenges(language);
      }
    }, [language, isTabScreen, prevRouteName]),
  );

  useEffect(() => {
    homePageStore.init(language);
  }, [language]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.progressBarSkeleton}>
          <Skeleton width={windowWidthMinusPaddings} height={250} />
        </View>
      ) : (
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
      )}
      {(isLoading || hasUserSwipedAnyQuestion) && (
        <View style={styles.homeCategoryWrapper}>
          <QuickStart isLoading={isLoading} />
        </View>
      )}
      <CategoriesCarousel isLoading={isLoading} />
      <View style={styles.challangesWrapper}>
        <Challanges isLoading={isLoading} />
      </View>
      <Quotes />
    </View>
  );
};

export default memo(observer(HomePage));

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
    marginBottom: verticalScale(40),
  },

  challangesWrapper: {
    marginTop: verticalScale(10),
    width: '100%',
  },

  progressBarSkeleton: {
    marginBottom: verticalScale(30),
  },
});
