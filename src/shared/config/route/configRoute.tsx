import {ComponentType} from 'react';

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
import {CategoryDetailsHeaderRight} from '@src/widgets/headers/CategoryDetailsHeaderRight';
import {QuestionsPage} from '@src/pages/QuestionsPage';
import {QuestionsHeaderRight} from '@src/widgets/headers/QuestionsHeaderRight';

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
};

type NewRouteProps = {
  authOnly?: boolean;
  name: string;
  Element: ComponentType;
  headerShown?: boolean;
  headerTitle?: string;
  HeaderRight?: ComponentType;
  isPageScrolling?: boolean;
  deleteBottomPadding?: boolean;
  deleteTopPadding?: boolean;
  isTitleLarge?: boolean;
};

export const appRoutesConfig: Record<AppRouteNames, NewRouteProps> = {
  [AppRouteNames.AUTH]: {
    name: appRoutePaths.auth,
    headerShown: false,
    Element: AuthPage,
    isPageScrolling: true,
    deleteTopPadding: true,
  },
  [AppRouteNames.SPLASH]: {
    name: appRoutePaths.splash,
    headerShown: false,
    Element: SplashPage,
    deleteBottomPadding: true,
    deleteTopPadding: true,
  },
  [AppRouteNames.SETUP]: {
    name: appRoutePaths.setup,
    headerShown: false,
    Element: SetUpPage,
    isPageScrolling: true,
  },

  // tab routes
  [AppRouteNames.TAB_ROUTE]: {
    name: appRoutePaths.tabRoute,
    headerShown: false,
    Element: TabRoute,
  },

  // pages with title
  [AppRouteNames.SETTINGS]: {
    name: appRoutePaths.settings,
    headerShown: true,
    headerTitle: 'settings.title',
    Element: SettingsPage,
    deleteBottomPadding: true,
  },
  [AppRouteNames.PROFILE]: {
    name: appRoutePaths.profile,
    headerShown: true,
    headerTitle: 'settings.profile',
    HeaderRight: ProfileHeaderRight,
    Element: ProfilePage,
    isPageScrolling: true,
  },
  [AppRouteNames.ABOUT]: {
    name: appRoutePaths.about,
    headerShown: true,
    headerTitle: 'settings.about',
    Element: AboutPage,
  },
  [AppRouteNames.PARTNERS]: {
    name: appRoutePaths.partners,
    headerShown: true,
    headerTitle: 'settings.partners',
    Element: PartnersPage,
  },
  [AppRouteNames.PRIVACY_POLICY]: {
    name: appRoutePaths.privacyPolicy,
    headerShown: true,
    headerTitle: 'settings.privacy_policy',
    Element: PrivacyPolicyPage,
    isTitleLarge: true,
  },
  [AppRouteNames.CHANGE_PASSWORD]: {
    name: appRoutePaths.changePassword,
    headerShown: true,
    headerTitle: 'settings.change_password',
    Element: ChangePasswordPage,
  },
  [AppRouteNames.HOW_TO_USE]: {
    name: appRoutePaths.howToUse,
    headerShown: true,
    headerTitle: 'settings.how_to_use',
    Element: HowToUsePage,
  },
  [AppRouteNames.CONTACT_US]: {
    name: appRoutePaths.contactUs,
    headerShown: true,
    headerTitle: 'settings.contact_us',
    Element: ContactUsPage,
  },
  [AppRouteNames.BOOK_DETAILS]: {
    name: appRoutePaths.bookDetails,
    headerShown: true,
    headerTitle: '',
    Element: BookDetailsPage,
    deleteTopPadding: true,
  },
  [AppRouteNames.CATEGORY_DETAILS]: {
    name: appRoutePaths.categoryDetails,
    headerShown: true,
    headerTitle: '',
    Element: CategoryDetailsPage,
    isPageScrolling: true,
    HeaderRight: CategoryDetailsHeaderRight,
  },
  [AppRouteNames.QUESTIONS]: {
    name: appRoutePaths.questions,
    headerShown: true,
    headerTitle: '',
    Element: QuestionsPage,
    HeaderRight: QuestionsHeaderRight,
    deleteTopPadding: true,
  },
};
