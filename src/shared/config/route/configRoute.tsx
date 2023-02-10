import React, {ComponentType} from 'react';

import {AuthPage} from '@src/pages/AuthPage';
import {SplashPage} from '@src/pages/SplashPage';
import {ResetPasswordPage} from '@src/pages/ResetPasswordPage';
import {Layout} from '@src/widgets/layout';
import {Main} from '@src/pages/Main';
import {SettingsPage} from '@src/pages/SettingsPage';
import {ProfileHeaderRight, ProfilePage} from '@src/pages/ProfilePage';
import {PartnersPage} from '@src/pages/PartnersPage';
import {PrivacyPolicyPage} from '@src/pages/PrivacyPolicyPage';
import {ChangePasswordPage} from '@src/pages/ChangePasswordPage';
import {SetUpPage} from '@src/pages/SetUpPage';
import {AboutPage} from '@src/pages/AboutPage';
import {HowToUsePage} from '@src/pages/HowToUsePage';
import {ContactUs} from '@src/pages/ContactUs';

export enum AppRouteNames {
  AUTH = 'auth',
  MAIN = 'main',
  SPLASH = 'splash',
  SETUP = 'setup',

  // pages with title
  RESET_PASSWORD = 'reset_password',
  SETTINGS = 'settings',
  PROFILE = 'profile',
  ABOUT = 'about',
  PARTNERS = 'partners',
  PRIVACY_POLICY = 'privacyPolicy',
  CHANGE_PASSWORD = 'changePassword',
  HOW_TO_USE = 'howToUse',
  CONTACT_US = 'contactUs',
}

export const appRoutePaths: Record<AppRouteNames, string> = {
  [AppRouteNames.AUTH]: 'auth',
  [AppRouteNames.MAIN]: 'main',
  [AppRouteNames.SPLASH]: 'splash',

  // pages with title
  [AppRouteNames.RESET_PASSWORD]: 'reset_password',
  [AppRouteNames.SETTINGS]: 'settings',
  [AppRouteNames.PROFILE]: 'profile',
  [AppRouteNames.ABOUT]: 'about',
  [AppRouteNames.PARTNERS]: 'partners',
  [AppRouteNames.PRIVACY_POLICY]: 'privacyPolicy',
  [AppRouteNames.CHANGE_PASSWORD]: 'changePassword',
  [AppRouteNames.SETUP]: 'setup',
  [AppRouteNames.HOW_TO_USE]: 'howToUse',
  [AppRouteNames.CONTACT_US]: 'contactUs',
};

type NewRouteProps = {
  authOnly?: boolean;
  name: string;
  Element: ComponentType;
  headerShown?: boolean;
  headerTitle?: string;
  HeaderRight?: ComponentType;
};

export const appRoutesConfig: Record<AppRouteNames, NewRouteProps> = {
  [AppRouteNames.AUTH]: {
    name: appRoutePaths.auth,
    headerShown: false,
    Element: props => (
      <Layout {...props}>
        <AuthPage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.SPLASH]: {
    name: appRoutePaths.splash,
    headerShown: false,
    Element: props => (
      <Layout {...props}>
        <SplashPage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.SETUP]: {
    name: appRoutePaths.setup,
    headerShown: false,
    Element: props => (
      <Layout {...props}>
        <SetUpPage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.MAIN]: {
    name: appRoutePaths.main,
    headerShown: false,
    Element: props => <Main {...props} />,
  },

  // pages with title
  [AppRouteNames.RESET_PASSWORD]: {
    name: appRoutePaths.reset_password,
    headerShown: true,
    headerTitle: 'Reset Password',
    Element: props => (
      <Layout {...props}>
        <ResetPasswordPage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.SETTINGS]: {
    name: appRoutePaths.settings,
    headerShown: true,
    headerTitle: 'Settings',
    Element: props => (
      <Layout {...props}>
        <SettingsPage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.PROFILE]: {
    name: appRoutePaths.profile,
    headerShown: true,
    headerTitle: 'Profile',
    HeaderRight: ProfileHeaderRight,
    Element: props => (
      <Layout {...props}>
        <ProfilePage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.ABOUT]: {
    name: appRoutePaths.about,
    headerShown: true,
    headerTitle: 'About',
    Element: props => (
      <Layout {...props}>
        <AboutPage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.PARTNERS]: {
    name: appRoutePaths.partners,
    headerShown: true,
    headerTitle: 'Partners',
    Element: props => (
      <Layout {...props}>
        <PartnersPage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.PRIVACY_POLICY]: {
    name: appRoutePaths.privacyPolicy,
    headerShown: true,
    headerTitle: 'Terms of Use & Privacy Policy',
    Element: props => (
      <Layout {...props}>
        <PrivacyPolicyPage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.CHANGE_PASSWORD]: {
    name: appRoutePaths.changePassword,
    headerShown: true,
    headerTitle: 'Change Password',
    Element: props => (
      <Layout {...props}>
        <ChangePasswordPage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.HOW_TO_USE]: {
    name: appRoutePaths.howToUse,
    headerShown: true,
    headerTitle: 'How to use',
    Element: props => (
      <Layout {...props}>
        <HowToUsePage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.CONTACT_US]: {
    name: appRoutePaths.contactUs,
    headerShown: true,
    headerTitle: 'Contact us',
    Element: props => (
      <Layout {...props}>
        <ContactUs {...props} />
      </Layout>
    ),
  },
};
