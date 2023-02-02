import React, {ComponentType} from 'react';

import {AuthPage} from '@src/pages/AuthPage';
import {SplashPage} from '@src/pages/SplashPage';
import {ResetPasswordPage} from '@src/pages/ResetPasswordPage';
import {Layout} from '@src/widgets/layout';
import {Main} from '@src/pages/Main';
import {SettingsPage} from '@src/pages/SettingsPage';
import {ProfilePage} from '@src/pages/ProfilePage';
import {AboutPage} from '@src/pages/About';
import {PartnersPage} from '@src/pages/PartnersPage';
import {PrivacyPolicyPage} from '@src/pages/PrivacyPolicyPage';

export enum AppRouteNames {
  AUTH = 'auth',
  MAIN = 'main',
  SPLASH = 'splash',
  RESET_PASSWORD = 'reset_password',

  // pages with title
  SETTINGS = 'settings',
  PROFILE = 'profile',
  ABOUT = 'about',
  PARTNERS = 'partners',
  PRIVACY_POLICY = 'privacyPolicy',
}

export const appRoutePaths: Record<AppRouteNames, string> = {
  [AppRouteNames.AUTH]: 'auth',
  [AppRouteNames.MAIN]: 'main',
  [AppRouteNames.SPLASH]: 'splash',
  [AppRouteNames.RESET_PASSWORD]: 'reset_password',

  // pages with title
  [AppRouteNames.SETTINGS]: 'settings',
  [AppRouteNames.PROFILE]: 'profile',
  [AppRouteNames.ABOUT]: 'about',
  [AppRouteNames.PARTNERS]: 'partners',
  [AppRouteNames.PRIVACY_POLICY]: 'privacyPolicy',
};

type NewRouteProps = {
  authOnly?: boolean;
  name: string;
  Element: ComponentType;
  headerShown?: boolean;
  headerTitle?: string;
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
  [AppRouteNames.RESET_PASSWORD]: {
    name: appRoutePaths.reset_password,
    headerShown: false,
    Element: props => (
      <Layout {...props}>
        <ResetPasswordPage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.MAIN]: {
    name: appRoutePaths.main,
    headerShown: false,
    Element: props => <Main {...props} />,
  },

  // pages with title
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
    headerTitle: 'Parnters',
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
};
