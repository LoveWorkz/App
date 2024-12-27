import React, {ComponentType} from 'react';
import {ParamListBase} from '@react-navigation/native';

import {AuthPage} from '@src/pages/AuthPage';
import {TabRoute} from '@src/app/providers/route/TabRoute';
import {SettingsPage} from '@src/pages/SettingsPage';
import {ProfilePage} from '@src/pages/ProfilePage';
import {PartnersPage} from '@src/pages/PartnersPage';
import {PrivacyPolicyPage} from '@src/pages/PrivacyPolicyPage';
import {ChangePasswordPage} from '@src/pages/ChangePasswordPage';
import {SetUpPage} from '@src/pages/SetUpPage';
import {AboutPage} from '@src/pages/AboutPage';
import {HowToUsePage} from '@src/pages/HowToUsePage';
import {ContactUsPage} from '@src/pages/ContactUsPage';
import {BookDetailsPage} from '@src/pages/BookDetailsPage';
import {CategoryDetailsPage} from '@src/pages/CategoryDetailsPage';
import {QuestionsPage} from '@src/pages/QuestionsPage';
import {Layout} from '@src/widgets/layout';
import {SessionsPage} from '@src/pages/SessionsPage';
import {SpecialChallengeCardsPage} from '@src/pages/SpecialChallengeCardsPage';
import {CoreChallengeCardsPage} from '@src/pages/CoreChallengeCardsPage';
import {NotificationsPage} from '@src/pages/NotificationsPage';
import {AboutMyRelationshipPage} from '@src/pages/AboutMyRelationshipPage';
import {YourGoalsPage} from '@src/pages/YourGoalsPage';
import {ChallengesHeaderRight} from '@src/widgets/headers/ChallengesHeaderRight';
import {FavoritesChallengesPage} from '@src/pages/ChallengesPage';
import {WelcomePage} from '@src/pages/Onboarding/WelcomePage';
import {ChallengeTypeInfoPage} from '@src/pages/ChallengeTypeInfoPage';
import {GoalsPage} from '@src/pages/Onboarding/GoalsPage';
import {OnboardingNotificationsPage} from '@src/pages/Onboarding/OnboardingNotificationsPage';
import {OnboardingStatisticPage} from '@src/pages/Onboarding/OnboardingStatisticPage';
import {SessionsHeaderRight} from '@src/widgets/headers/SessionsHeaderRight';
import {FavoriteSessionsPage} from '@src/pages/FavoriteSessionsPage';
import {PreSessionPage} from '@src/pages/PreSessionPage';
import {BreakPage} from '@src/pages/BreakPage';
import {SpecialChallengeHeaderRight} from '@src/widgets/headers/SpecialChallengeHeaderRight';
import {SpecialChallengeIntroPage} from '@src/pages/SpecialChallengeIntroPage';
import {
  CompletionPage,
  QuadrantCompletionPage,
} from '@src/pages/CompletionPage';
import {QuadrantDetailsPage} from '@src/pages/QuadrantDetailsPage';
import {GameRulesPage} from '@src/pages/GameRulesPage';
import {CoreChallengeIntroPage} from '@src/pages/CoreChallengeIntroPage';
import {SpecialChallengeIntroHeaderRight} from '@src/widgets/headers/SpecialChallengeIntroHeaderRight';
import {SplashPage} from '@src/pages/SplashPage/ui/SplashPage';
import themeStyle from '@src/app/styles/themeStyle';
import {PartnerDetailsPage} from '@src/pages/PartnerDetailsPage';

export enum AppRouteNames {
  AUTH = 'auth',
  SETUP = 'setup',
  SPLASH = 'splash',
  TAB_ROUTE = 'tabRoute',

  // pages with title
  ABOUT = 'about',
  ABOUT_MY_RELATIONSHIP = 'aboutMyRelationship',
  BOOK_DETAILS = 'bookDetails',
  BREAK = 'break',
  CATEGORY_DETAILS = 'categoryDetails',
  CHALLENGE_TYPE_INFO = 'challengeTypeInfo',
  CHANGE_PASSWORD = 'changePassword',
  COMPLETION = 'completion',
  CONTACT_US = 'contactUs',
  CORE_CHALLENGE_CARDS = 'coreChallengeCards',
  CORE_CHALLENGE_INTRO = 'coreChallengeIntro',
  FAVORITE_SESSIONS = 'favoriteSessions',
  FAVORITES_CHALLENGES = 'favoritesChallenges',
  GAME_RULES = 'gameRules',
  HOW_TO_USE = 'howToUse',
  NOTIFICATIONS = 'notifications',
  ONBOARDING_GOALS = 'onboardingGoals',
  ONBOARDING_NOTIFICATIONS = 'onboardingNotifications',
  ONBOARDING_STATISTIC = 'onboardingStatistic',
  PARTNERS = 'partners',
  PARTNER_DETAILS = 'partnerDetails',
  PRE_SESSION = 'preSession',
  PRIVACY_POLICY = 'privacyPolicy',
  PROFILE = 'profile',
  QUADRANT_COMPLETION = 'quadrantCompletion',
  QUADRANT_DETAILS = 'quadrantDetails',
  QUESTIONS = 'questions',
  SESSIONS = 'sessions',
  SETTINGS = 'settings',
  SPECIAL_CHALLENGE_CARDS = 'specialChallengeCards',
  SPECIAL_CHALLENGE_INTRO = 'specialChallengeIntro',
  WELCOME = 'welcome',
  YOUR_GOALS = 'yourGoals',
}

export const appRoutePaths: Record<AppRouteNames, string> = {
  [AppRouteNames.AUTH]: 'auth',
  [AppRouteNames.SPLASH]: 'splash',
  [AppRouteNames.TAB_ROUTE]: 'tabRoute',

  // pages with title
  [AppRouteNames.ABOUT_MY_RELATIONSHIP]: 'aboutMyRelationship',
  [AppRouteNames.ABOUT]: 'about',
  [AppRouteNames.BOOK_DETAILS]: 'bookDetails',
  [AppRouteNames.BREAK]: 'break',
  [AppRouteNames.CATEGORY_DETAILS]: 'categoryDetails',
  [AppRouteNames.CHALLENGE_TYPE_INFO]: 'challengeTypeInfo',
  [AppRouteNames.CHANGE_PASSWORD]: 'changePassword',
  [AppRouteNames.COMPLETION]: 'completion',
  [AppRouteNames.CONTACT_US]: 'contactUs',
  [AppRouteNames.CORE_CHALLENGE_CARDS]: 'coreChallengeCards',
  [AppRouteNames.CORE_CHALLENGE_INTRO]: 'coreChallengeIntro',
  [AppRouteNames.FAVORITE_SESSIONS]: 'favoriteSessions',
  [AppRouteNames.FAVORITES_CHALLENGES]: 'favoritesChallenges',
  [AppRouteNames.GAME_RULES]: 'gameRules',
  [AppRouteNames.HOW_TO_USE]: 'howToUse',
  [AppRouteNames.NOTIFICATIONS]: 'notifications',
  [AppRouteNames.PARTNERS]: 'partners',
  [AppRouteNames.PARTNER_DETAILS]: 'partnerDetails',
  [AppRouteNames.PRE_SESSION]: 'preSession',
  [AppRouteNames.PRIVACY_POLICY]: 'privacyPolicy',
  [AppRouteNames.PROFILE]: 'profile',
  [AppRouteNames.QUADRANT_COMPLETION]: 'quadrantCompletion',
  [AppRouteNames.QUADRANT_DETAILS]: 'quadrantDetails',
  [AppRouteNames.QUESTIONS]: 'questions',
  [AppRouteNames.SESSIONS]: 'sessions',
  [AppRouteNames.SETTINGS]: 'settings',
  [AppRouteNames.SETUP]: 'setup',
  [AppRouteNames.SPECIAL_CHALLENGE_CARDS]: 'specialChallengeCards',
  [AppRouteNames.SPECIAL_CHALLENGE_INTRO]: 'specialChallengeIntro',
  [AppRouteNames.YOUR_GOALS]: 'yourGoals',

  // onboarding
  [AppRouteNames.ONBOARDING_GOALS]: 'onboardingGoals',
  [AppRouteNames.ONBOARDING_NOTIFICATIONS]: 'onboardingNotifications',
  [AppRouteNames.ONBOARDING_STATISTIC]: 'onboardingStatistic',
  [AppRouteNames.WELCOME]: 'welcome',
};

export type BgColor = 'secondaryBackground' | 'white' | '#e8ecf9';

export type NewRouteProps = {
  authOnly?: boolean;
  bgColor?: BgColor;
  bgColorOverride?: keyof typeof themeStyle.dark;
  Element: ComponentType;
  HeaderRight?: ComponentType;
  headerShown?: boolean;
  headerTitle?: string;
  isAboutMyRelationshipPage?: boolean;
  isTitleLarge?: boolean;
  name: string;
};

export const appRoutesConfig: Record<AppRouteNames, NewRouteProps> = {
  [AppRouteNames.AUTH]: {
    name: appRoutePaths.auth,
    headerShown: false,
    Element: (props: ParamListBase) => {
      return (
        <Layout isPageScrolling={true}>
          <AuthPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.SPLASH]: {
    name: appRoutePaths.splash,
    headerShown: false,
    Element: (props: ParamListBase) => {
      return (
        <Layout deleteTopPadding={true} deleteBottomPadding={true}>
          <SplashPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.SETUP]: {
    name: appRoutePaths.setup,
    headerShown: false,
    Element: (props: ParamListBase) => {
      return (
        <Layout isPageScrolling={true}>
          <SetUpPage {...props} />
        </Layout>
      );
    },
  },

  // pages with title
  [AppRouteNames.SETTINGS]: {
    name: appRoutePaths.settings,
    headerShown: true,
    headerTitle: 'settings.title',
    Element: (props: ParamListBase) => {
      return (
        <Layout deleteBottomPadding={true} isPageScrolling={true}>
          <SettingsPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.PROFILE]: {
    name: appRoutePaths.profile,
    headerShown: true,
    headerTitle: 'settings.about_me',
    Element: (props: ParamListBase) => {
      return (
        <Layout isPageScrolling={true}>
          <ProfilePage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.ABOUT]: {
    name: appRoutePaths.about,
    headerShown: false,
    headerTitle: 'settings.about',
    Element: (props: ParamListBase) => {
      return (
        <Layout deleteTopPadding deleteGlobalPadding deleteBottomPadding>
          <AboutPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.PARTNERS]: {
    name: appRoutePaths.partners,
    headerShown: true,
    headerTitle: 'settings.partners',
    Element: (props: ParamListBase) => {
      return (
        <Layout isPageScrolling>
          <PartnersPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.PARTNER_DETAILS]: {
    name: appRoutePaths.partnerDetails,
    headerShown: false,
    Element: (props: ParamListBase) => {
      return (
        // <Layout isPageScrolling>
        <Layout deleteTopPadding deleteGlobalPadding>
          <PartnerDetailsPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.PRIVACY_POLICY]: {
    name: appRoutePaths.privacyPolicy,
    headerShown: true,
    headerTitle: 'settings.privacy_policy',
    isTitleLarge: true,
    Element: (props: ParamListBase) => {
      return (
        <Layout>
          <PrivacyPolicyPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.CHANGE_PASSWORD]: {
    name: appRoutePaths.changePassword,
    headerShown: true,
    headerTitle: 'settings.change_password',
    Element: (props: ParamListBase) => {
      return (
        <Layout>
          <ChangePasswordPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.HOW_TO_USE]: {
    name: appRoutePaths.howToUse,
    headerShown: true,
    headerTitle: 'Loveworkz',
    Element: (props: ParamListBase) => {
      return (
        <Layout deleteTopPadding isPageScrolling>
          <HowToUsePage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.CONTACT_US]: {
    name: appRoutePaths.contactUs,
    headerShown: true,
    headerTitle: 'settings.contact_us',
    Element: (props: ParamListBase) => {
      return (
        <Layout>
          <ContactUsPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.BOOK_DETAILS]: {
    name: appRoutePaths.bookDetails,
    headerShown: true,
    headerTitle: '',
    Element: (props: ParamListBase) => {
      return (
        <Layout deleteTopPadding={true}>
          <BookDetailsPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.CATEGORY_DETAILS]: {
    name: appRoutePaths.categoryDetails,
    headerShown: true,
    headerTitle: '',
    Element: (props: ParamListBase) => {
      return (
        <Layout isPageScrolling={true}>
          <CategoryDetailsPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.QUESTIONS]: {
    name: appRoutePaths.questions,
    headerShown: false,
    headerTitle: '',
    Element: (props: ParamListBase) => {
      return (
        <Layout deleteTopPadding={true} deleteBottomPadding={true}>
          <QuestionsPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.SESSIONS]: {
    name: appRoutePaths.sessions,
    headerShown: true,
    headerTitle: 'sessions.sessionOverview',
    HeaderRight: () => <SessionsHeaderRight />,
    Element: (props: ParamListBase) => {
      return (
        <Layout isPageScrolling>
          <SessionsPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.FAVORITE_SESSIONS]: {
    name: appRoutePaths.favoriteSessions,
    headerShown: true,
    headerTitle: 'sessions.favouriteSessions',
    HeaderRight: () => <SessionsHeaderRight isFavorite />,
    Element: (props: ParamListBase) => {
      return (
        <Layout isPageScrolling>
          <FavoriteSessionsPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.SPECIAL_CHALLENGE_CARDS]: {
    name: appRoutePaths.specialChallengeCards,
    headerShown: true,
    bgColor: 'secondaryBackground',
    headerTitle: '',
    HeaderRight: SpecialChallengeHeaderRight,
    isTitleLarge: true,
    Element: (props: ParamListBase) => {
      return (
        <Layout bgColor="secondaryBackground">
          <SpecialChallengeCardsPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.CORE_CHALLENGE_CARDS]: {
    name: appRoutePaths.coreChallengeCards,
    headerShown: true,
    headerTitle: '',
    bgColor: 'secondaryBackground',
    HeaderRight: ChallengesHeaderRight,
    bgColorOverride: 'backgroundSecondary',
    Element: (props: ParamListBase) => {
      return (
        <Layout
          bgColor="secondaryBackground"
          bgColorOverride="backgroundSecondary">
          <CoreChallengeCardsPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.NOTIFICATIONS]: {
    name: appRoutePaths.notifications,
    headerShown: true,
    headerTitle: 'notifications.title',
    Element: (props: ParamListBase) => {
      return (
        <Layout>
          <NotificationsPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.ABOUT_MY_RELATIONSHIP]: {
    name: appRoutePaths.aboutMyRelationship,
    headerShown: true,
    isAboutMyRelationshipPage: true,
    headerTitle: 'settings.about_my_relationship',
    Element: (props: ParamListBase) => {
      return (
        <Layout>
          <AboutMyRelationshipPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.YOUR_GOALS]: {
    name: appRoutePaths.yourGoals,
    headerShown: true,
    headerTitle: 'settings.your_goals',
    Element: (props: ParamListBase) => {
      return (
        <Layout>
          <YourGoalsPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.FAVORITES_CHALLENGES]: {
    name: appRoutePaths.favoritesChallenges,
    Element: (props: ParamListBase) => {
      return (
        <Layout
          isPageScrolling={false}
          deleteBottomPadding={false}
          deleteTopPadding={true}>
          <FavoritesChallengesPage {...props} />
        </Layout>
      );
    },
    headerTitle: 'challenge.favourite_Challenges',
    headerShown: true,
  },
  [AppRouteNames.CHALLENGE_TYPE_INFO]: {
    name: appRoutePaths.challengeTypeInfo,
    bgColor: 'secondaryBackground',
    bgColorOverride: 'backgroundSecondary',
    Element: (props: ParamListBase) => {
      return (
        <Layout
          bgColor="secondaryBackground"
          bgColorOverride="backgroundSecondary">
          <ChallengeTypeInfoPage {...props} />
        </Layout>
      );
    },
    headerTitle: 'challenge.title',
    headerShown: true,
  },

  // onboarding
  [AppRouteNames.WELCOME]: {
    name: appRoutePaths.welcome,
    bgColor: 'bgQuinaryColor' as BgColor,
    Element: (props: ParamListBase) => {
      return (
        <Layout bgColor={'bgQuinaryColor' as BgColor}>
          <WelcomePage {...props} />
        </Layout>
      );
    },
    headerShown: false,
  },
  [AppRouteNames.ONBOARDING_GOALS]: {
    name: appRoutePaths.onboardingGoals,
    Element: (props: ParamListBase) => {
      return (
        <Layout>
          <GoalsPage {...props} />
        </Layout>
      );
    },
    headerShown: false,
  },
  [AppRouteNames.ONBOARDING_NOTIFICATIONS]: {
    name: appRoutePaths.onboardingNotifications,
    Element: (props: ParamListBase) => {
      return (
        <Layout bgColorOverride="bgOnboardingColor">
          <OnboardingNotificationsPage {...props} />
        </Layout>
      );
    },
    headerShown: false,
  },
  [AppRouteNames.ONBOARDING_STATISTIC]: {
    name: appRoutePaths.onboardingStatistic,
    Element: (props: ParamListBase) => {
      return (
        <Layout bgColorOverride="bgOnboardingColor" deleteGlobalPadding>
          <OnboardingStatisticPage {...props} />
        </Layout>
      );
    },
    headerShown: false,
  },
  [AppRouteNames.PRE_SESSION]: {
    name: appRoutePaths.preSession,
    headerShown: true,
    headerTitle: 'sessions.todaysSession',
    Element: (props: ParamListBase) => {
      return (
        <Layout isPageScrolling>
          <PreSessionPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.BREAK]: {
    name: appRoutePaths.break,
    headerShown: false,
    bgColor: 'secondaryBackground',
    bgColorOverride: 'backgroundSecondary',
    headerTitle: '',
    Element: (props: ParamListBase) => {
      return (
        <Layout
          deleteTopPadding
          deleteGlobalPadding
          bgColor="secondaryBackground"
          bgColorOverride="backgroundSecondary">
          <BreakPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.SPECIAL_CHALLENGE_INTRO]: {
    name: appRoutePaths.specialChallengeIntro,
    headerShown: true,
    bgColor: 'secondaryBackground',
    bgColorOverride: 'backgroundSecondary',
    headerTitle: '',
    HeaderRight: SpecialChallengeIntroHeaderRight,
    Element: (props: ParamListBase) => {
      return (
        <Layout
          deleteTopPadding
          isPageScrolling
          bgColor="secondaryBackground"
          bgColorOverride="backgroundSecondary">
          <SpecialChallengeIntroPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.COMPLETION]: {
    name: appRoutePaths.completion,
    headerShown: false,
    bgColor: 'secondaryBackground',
    bgColorOverride: 'backgroundTertiary',
    Element: (props: ParamListBase) => {
      return (
        <Layout
          isPageScrolling
          deleteGlobalPadding
          bgColor="secondaryBackground"
          bgColorOverride="backgroundTertiary">
          <CompletionPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.QUADRANT_COMPLETION]: {
    name: appRoutePaths.quadrantCompletion,
    headerShown: false,
    bgColor: 'secondaryBackground',
    Element: (props: ParamListBase) => {
      return (
        <Layout
          isPageScrolling
          deleteGlobalPadding
          bgColor="secondaryBackground">
          <QuadrantCompletionPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.QUADRANT_DETAILS]: {
    name: appRoutePaths.quadrantDetails,
    headerShown: false,
    Element: (props: ParamListBase) => {
      return (
        <Layout deleteGlobalPadding deleteTopPadding deleteBottomPadding>
          <QuadrantDetailsPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.GAME_RULES]: {
    name: appRoutePaths.gameRules,
    headerShown: false,
    Element: (props: ParamListBase) => {
      return (
        <Layout deleteGlobalPadding deleteTopPadding>
          <GameRulesPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.CORE_CHALLENGE_INTRO]: {
    name: appRoutePaths.coreChallengeIntro,
    headerShown: true,
    bgColor: 'secondaryBackground',
    bgColorOverride: 'backgroundSecondary',
    headerTitle: '',
    Element: (props: ParamListBase) => {
      return (
        <Layout
          bgColor="secondaryBackground"
          bgColorOverride="backgroundSecondary">
          <CoreChallengeIntroPage {...props} />
        </Layout>
      );
    },
  },

  // tab routes
  [AppRouteNames.TAB_ROUTE]: {
    name: appRoutePaths.tabRoute,
    headerShown: false,
    Element: TabRoute,
  },
};
