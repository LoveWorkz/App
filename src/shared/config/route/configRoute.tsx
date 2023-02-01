import React, {ComponentType} from 'react';

import {AuthPage} from '@src/pages/AuthPage';
import {SplashPage} from '@src/pages/SplashPage';
import {ResetPasswordPage} from '@src/pages/ResetPasswordPage';
import {Layout} from '@src/widgets/layout';
import {Main} from '@src/pages/Main';
import {SettingsPage} from '@src/pages/SettingsPage';
import {ProfilePage} from '@src/pages/ProfilePage';

export enum AppRouteNames {
  AUTH = 'auth',
  MAIN = 'main',
  SPLASH = 'splash',
  RESET_PASSWORD = 'reset_password',
  SETTINGS = 'settings',
  PROFILE = 'profile',
}

export const appRoutePaths: Record<AppRouteNames, string> = {
  [AppRouteNames.AUTH]: 'auth',
  [AppRouteNames.MAIN]: 'main',
  [AppRouteNames.SPLASH]: 'splash',
  [AppRouteNames.RESET_PASSWORD]: 'reset_password',
  [AppRouteNames.SETTINGS]: 'settings',
  [AppRouteNames.PROFILE]: 'profile',
};

type NewRouteProps = {
  authOnly?: boolean;
  name: string;
  Element: ComponentType;
  headerShown?: boolean;
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
  [AppRouteNames.SETTINGS]: {
    name: appRoutePaths.settings,
    headerShown: true,
    Element: props => (
      <Layout {...props}>
        <SettingsPage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.PROFILE]: {
    name: appRoutePaths.profile,
    headerShown: true,
    Element: props => (
      <Layout {...props}>
        <ProfilePage {...props} />
      </Layout>
    ),
  },
};
