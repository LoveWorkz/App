import React, {memo, useCallback, useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
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
  tabBarHeight,
  windowWidth,
  windowWidthMinusPaddings,
} from '@src/app/styles/GlobalStyle';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {HEADER_HEIGHT, isPlatformIos} from '@src/shared/consts/common';
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
import {userStore} from '@src/entities/User';
import {TrendingList} from '@src/entities/Rubric';
import {TrendingChallengeList} from '@src/entities/Challenge';
import {DiscountOfferCard} from '@src/widgets/DiscountOfferCard';
import {
  GuidedTour,
  guidedTourStore,
} from '@src/widgets/GuidedTour';
import CategoriesCarousel from './CategoriesCarousel/CategoriesCarousel';
import QuickStart from './QuickStart/QuickStart';
import homePageStore from '../model/store/HomePageStore';
import ProgressBar from './ProgressBar/ProgressBar';
import QuestionPageCongratsModal from '@src/pages/QuestionsPage/ui/QuestionPageCongratsModal/QuestionPageCongratsModal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { useColors } from '@src/app/providers/colorsProvider';
import { userSchedulersAdapterStorage } from '@src/shared/lib/storage/adapters/userSchedulersAdapter';
import { USER_SCHEDULERS_KEY } from '@src/shared/consts/storage';
import { DayBlock } from '@src/widgets/UserScheduler/model/types/userSchedular';
import { notifeeLib } from '@src/shared/lib/notifee/notifee';
import { add } from 'date-fns';
import UserSchedulerStore from '@src/widgets/UserScheduler/model/store/UserSchedulerStore';
interface HomePageProps {
  prevRouteName?: string;
  isTabScreen?: boolean;
}

const contentTop = horizontalScale(isPlatformIos ? -165 : -195);
const skeletonContentTop = -20;

const HomePage = (props: HomePageProps) => {
  const {isTabScreen, prevRouteName} = props;
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();

  console.log('INSETS', insets);

  const {theme, isDark} = useTheme();
  const {i18n} = useTranslation();
  const colors = useColors();
  const hasUserSubscription = userStore.getUserHasSubscription();

  const language = i18n.language as LanguageValueType;
  const isLoading = homePageStore.isHomePageLoading;
  const isGuidedTourCompleted = guidedTourStore.isGuidedTourCompleted;

  useEffect(() => {
    (async function() {
       const storage = await userSchedulersAdapterStorage.getUserSchedulers(USER_SCHEDULERS_KEY);
      
       if(!storage) return;

       const storageParse = JSON.parse(storage);
       let storageUser = storageParse.find((userData: { userId: string; }) => userData.userId === userStore.userId);

       if(!storageUser) return;
       
       storageUser.data = await Promise.all(storageUser.data.map(async (dayBlock: DayBlock) => {

        // Calculate the notification time based on the dropdown value
        const notificationTime = UserSchedulerStore.scheduleWeeklyNotification(
          dayBlock.day,
          dayBlock.time,
          dayBlock.dropdownValue,
          UserSchedulerStore.weekdays
        );

        // Schedule the notification
        const scheduleNotificationId = await notifeeLib.scheduleWeeklyNotification(
          new Date(notificationTime),
          new Date(dayBlock.time)
        );

        return {...dayBlock, scheduleNotificationId}
       }));

       // Update storage new notifications Id
       await userSchedulersAdapterStorage.setUserSchedulers(USER_SCHEDULERS_KEY, JSON.stringify(storageParse));
    })();
  },[]);

  useFocusEffect(
    useCallback(() => {
      // when user returns from any tab screen or completion page, get actual challenges and categories data
      if (
        isTabScreen ||
        prevRouteName === AppRouteNames.COMPLETION ||
        prevRouteName === AppRouteNames.QUADRANT_COMPLETION ||
        prevRouteName === AppRouteNames.SESSIONS ||
        prevRouteName === AppRouteNames.QUESTIONS
      ) {
        homePageStore.fetchHomePageCategoriesAndChallenges(language);
      }
    }, [language, isTabScreen, prevRouteName]),
  );

  useEffect(() => {
    homePageStore.init(language);
  }, [language]);

  return (
    <>
      <StatusBar
        barStyle={'light-content'} 
        backgroundColor={isDark ? colors.bgColor : 'transparent'}
        translucent={true}
      />
      <View
        style={[
          styles.HomePage,
          // eslint-disable-next-line react-native/no-inline-styles
          {marginBottom: isLoading ? 0 : horizontalScale(-HEADER_HEIGHT)},
        ]}>
        <HomePageHeader isLoading={isLoading} />
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
              }
              resizeMode={FastImage.resizeMode.contain}>
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
            {!hasUserSubscription && (
              <View style={styles.discountOfferCardWrapper}>
                <DiscountOfferCard isLoading={isLoading} />
              </View>
            )}

            <CategoriesCarousel isLoading={isLoading} />

            <TrendingList isLoading={isLoading} />
            <View style={styles.trendingChallengeWrapper}>
              <TrendingChallengeList isLoading={isLoading} />
            </View>
          </View>
          {/* show quotes popup only if Guided Tour is completed */}
          {isGuidedTourCompleted && !isLoading && <Quotes />}
          {!isLoading && <GuidedTour />}
        </View>
        {!isLoading && <QuestionPageCongratsModal />}
      </View>
    </>
  );
};

interface HomePageWrapperProps {
  route?: {
    params: {
      prevRouteName: AppRouteNames | TabRoutesNames;
      isTabScreen: boolean;
    };
  };
}

const style = {
  backgroundColor: 'transparent',
  paddingBottom: 20,
};

const StepNumberComponent = () => <></>;

const HomePageWrapper = memo(observer(HomePage));

export default memo((props: HomePageWrapperProps) => {
  const {route} = props;

  const prevRouteName = route?.params?.prevRouteName;
  const isTabScreen = route?.params?.isTabScreen;

  const insets = useSafeAreaInsets();

  return (
      <HomePageWrapper
        prevRouteName={prevRouteName}
        isTabScreen={isTabScreen}
      />
  );
});

const styles = StyleSheet.create({
  HomePage: {
    flex: 1,
    left: -globalPadding,
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
  discountOfferCardWrapper: {
    alignItems: 'center',
    marginBottom: horizontalScale(25),
  },
  trendingChallengeList: {
    width: windowWidth,
    left: horizontalScale(-10),
  },
  trendingChallengeWrapper: {
    marginTop: horizontalScale(25),
  },

  progressBarSkeleton: {
    marginBottom: horizontalScale(30),
  },
  walkthroughableWiew: {
    position: 'absolute',
    // borderWidth: 2,
    // borderColor: 'red',
    height: 320,
    // bottom: isPlatformIos ? 320 : 370,
    // top:
    //   Dimensions.get('screen').height -
    //   320 -
    //   tabBarHeight +
    //   StatusBar.currentHeight,
  },
});