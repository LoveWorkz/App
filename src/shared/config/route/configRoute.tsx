import React, {ComponentType} from 'react';
import {ParamListBase} from '@react-navigation/native';

import {AuthPage} from '@src/pages/AuthPage';
import {SplashPage} from '@src/pages/SplashPage';
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
import {ProfileHeaderRight} from '@src/widgets/headers/ProfileHeaderRight';
import {QuestionsPage} from '@src/pages/QuestionsPage';
import {QuestionsHeaderRight} from '@src/widgets/headers/QuestionsHeaderRight';
import {Layout} from '@src/app/providers/layout';
import {PartnerEditPage} from '@src/pages/PartnerEditPage';

export enum AppRouteNames {
  AUTH = 'auth',
  TAB_ROUTE = 'tabRoute',
  SPLASH = 'splash',
  SETUP = 'setup',

  // pages with title
  SETTINGS = 'settings',
  PROFILE = 'profile',
  ABOUT = 'about',
  PARTNERS = 'partners',
  PRIVACY_POLICY = 'privacyPolicy',
  CHANGE_PASSWORD = 'changePassword',
  HOW_TO_USE = 'howToUse',
  CONTACT_US = 'contactUs',
  BOOK_DETAILS = 'bookDetails',
  CATEGORY_DETAILS = 'categoryDetails',
  QUESTIONS = 'questions',
  PARTNER_EDIT = 'partnerEdit',
}

export const appRoutePaths: Record<AppRouteNames, string> = {
  [AppRouteNames.AUTH]: 'auth',
  [AppRouteNames.TAB_ROUTE]: 'tabRoute',
  [AppRouteNames.SPLASH]: 'splash',

  // pages with title
  [AppRouteNames.SETTINGS]: 'settings',
  [AppRouteNames.PROFILE]: 'profile',
  [AppRouteNames.ABOUT]: 'about',
  [AppRouteNames.PARTNERS]: 'partners',
  [AppRouteNames.PRIVACY_POLICY]: 'privacyPolicy',
  [AppRouteNames.CHANGE_PASSWORD]: 'changePassword',
  [AppRouteNames.SETUP]: 'setup',
  [AppRouteNames.HOW_TO_USE]: 'howToUse',
  [AppRouteNames.CONTACT_US]: 'contactUs',
  [AppRouteNames.BOOK_DETAILS]: 'bookDetails',
  [AppRouteNames.CATEGORY_DETAILS]: 'categoryDetails',
  [AppRouteNames.QUESTIONS]: 'questions',
  [AppRouteNames.PARTNER_EDIT]: 'partnerEdit',
};

type NewRouteProps = {
  authOnly?: boolean;
  name: string;
  Element: ComponentType;
  headerShown?: boolean;
  headerTitle?: string;
  HeaderRight?: ComponentType;
  isTitleLarge?: boolean;
};

export const appRoutesConfig: Record<AppRouteNames, NewRouteProps> = {
  [AppRouteNames.AUTH]: {
    name: appRoutePaths.auth,
    headerShown: false,
    Element: (props: ParamListBase) => {
      return (
        <Layout isPageScrolling={true} deleteTopPadding={true}>
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
    headerTitle: 'settings.profile',
    HeaderRight: ProfileHeaderRight,
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
    headerShown: true,
    headerTitle: 'settings.about',
    Element: (props: ParamListBase) => {
      return (
        <Layout>
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
        <Layout>
          <PartnersPage {...props} />
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
    headerTitle: 'settings.how_to_use',
    Element: (props: ParamListBase) => {
      return (
        <Layout>
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
    headerShown: true,
    headerTitle: '',
    HeaderRight: QuestionsHeaderRight,
    Element: (props: ParamListBase) => {
      return (
        <Layout deleteTopPadding={true}>
          <QuestionsPage {...props} />
        </Layout>
      );
    },
  },
  [AppRouteNames.PARTNER_EDIT]: {
    name: appRoutePaths.partnerEdit,
    headerShown: true,
    headerTitle: 'profile.partner',
    Element: (props: ParamListBase) => {
      return (
        <Layout>
          <PartnerEditPage {...props} />
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
