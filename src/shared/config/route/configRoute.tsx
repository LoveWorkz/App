import React, {ComponentType} from 'react';

import {HomePage} from '@src/pages/HomePage';
import {AuthPage} from '@src/pages/AuthPage';
import {SplashPage} from '@src/pages/SplashPage';
import {ResetPasswordPage} from '@src/pages/ResetPasswordPage';
import {Categories} from '@src/pages/Categories';
import {Layout} from '@src/widgets/layout';
import {Main} from '@src/pages/Main';
import {BooksPage} from '@src/pages/Books';
import {ChallengesPage} from '@src/pages/ChallengesPage';
import {ShopPage} from '@src/pages/ShopPage';

export enum AppRouteNames {
  AUTH = 'auth',
  MAIN = 'main',
  SPLASH = 'splash',
  RESET_PASSWORD = 'reset_password',

  // bottom tabs
  HOME = 'home',
  CATEGORIES = 'categories',
  BOOKS = 'books',
  CHALLENGES = 'challenges',
  SHOP = 'shop',
}

export const appRoutePaths: Record<AppRouteNames, string> = {
  [AppRouteNames.AUTH]: 'auth',
  [AppRouteNames.MAIN]: 'main',
  [AppRouteNames.SPLASH]: 'splash',
  [AppRouteNames.RESET_PASSWORD]: 'reset_password',

  // bottom tabs
  [AppRouteNames.HOME]: 'home',
  [AppRouteNames.CATEGORIES]: 'categories',
  [AppRouteNames.BOOKS]: 'books',
  [AppRouteNames.CHALLENGES]: 'challenges',
  [AppRouteNames.SHOP]: 'shop',
};

type NewRouteProps = {
  authOnly?: boolean;
  name: string;
  Element: ComponentType;
  isTab?: boolean;
};

export const appRoutesConfig: Record<AppRouteNames, NewRouteProps> = {
  [AppRouteNames.AUTH]: {
    name: appRoutePaths.auth,
    Element: props => (
      <Layout {...props}>
        <AuthPage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.SPLASH]: {
    name: appRoutePaths.splash,
    Element: props => (
      <Layout {...props}>
        <SplashPage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.RESET_PASSWORD]: {
    name: appRoutePaths.reset_password,
    Element: props => (
      <Layout {...props}>
        <ResetPasswordPage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.MAIN]: {
    name: appRoutePaths.main,
    Element: props => <Main {...props} />,
  },

  // bottom tabs

  [AppRouteNames.HOME]: {
    isTab: true,
    name: appRoutePaths.home,
    Element: props => (
      <Layout {...props}>
        <HomePage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.CATEGORIES]: {
    isTab: true,
    name: appRoutePaths.categories,
    Element: props => (
      <Layout {...props}>
        <Categories {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.BOOKS]: {
    isTab: true,
    name: appRoutePaths.books,
    Element: props => (
      <Layout {...props}>
        <BooksPage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.CHALLENGES]: {
    isTab: true,
    name: appRoutePaths.challenges,
    Element: props => (
      <Layout {...props}>
        <ChallengesPage {...props} />
      </Layout>
    ),
  },
  [AppRouteNames.SHOP]: {
    isTab: true,
    name: appRoutePaths.shop,
    Element: props => (
      <Layout {...props}>
        <ShopPage {...props} />
      </Layout>
    ),
  },
};
