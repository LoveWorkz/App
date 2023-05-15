import React, {ComponentType} from 'react';

import {HomePage} from '@src/pages/HomePage';
import {ChallengesPage} from '@src/pages/ChallengesPage';
import {ShopPage} from '@src/pages/ShopPage';
import {CategoriesPage} from '@src/pages/CategoriesPage';
import {BooksPage} from '@src/pages/BooksPage';
import {HomePageHeaderLeft} from '@src/widgets/headers/HomePageHeaderLeft';
import {TabHeaderLeft} from '@src/widgets/headers/TabHeaderLeft';
import {Layout} from '@src/app/providers/layout';
import {ParamListBase} from '@react-navigation/native';

export enum TabRoutesNames {
  HOME = 'home',
  CATEGORIES = 'categories',
  BOOKS = 'books',
  CHALLENGES = 'challenges',
  SHOP = 'shop',
}

export const tabRoutePaths: Record<TabRoutesNames, string> = {
  [TabRoutesNames.HOME]: 'home',
  [TabRoutesNames.CATEGORIES]: 'categories',
  [TabRoutesNames.BOOKS]: 'books',
  [TabRoutesNames.CHALLENGES]: 'challenges',
  [TabRoutesNames.SHOP]: 'shop',
};

type NewRouteProps = {
  authOnly?: boolean;
  name: string;
  Element: ComponentType;
  headerTitle?: string;
  headerShown?: boolean;
  HeaderLeft?: ComponentType<any>;
  isHomePage?: boolean;
};

export const tabRoutesConfig: Record<TabRoutesNames, NewRouteProps> = {
  [TabRoutesNames.CATEGORIES]: {
    name: tabRoutePaths.categories,
    Element: (props: ParamListBase) => {
      return (
        <Layout
          isPageScrolling={true}
          deleteBottomPadding={false}
          deleteTopPadding={false}
          isTabBar>
          <CategoriesPage {...props} />
        </Layout>
      );
    },
    headerTitle: 'questions.title',
    headerShown: true,
    HeaderLeft: TabHeaderLeft,
  },
  [TabRoutesNames.CHALLENGES]: {
    name: tabRoutePaths.challenges,
    Element: (props: ParamListBase) => {
      return (
        <Layout
          isPageScrolling={true}
          deleteBottomPadding={false}
          deleteTopPadding={false}
          isTabBar>
          <ChallengesPage {...props} />
        </Layout>
      );
    },
    headerTitle: 'challenge.title',
    headerShown: true,
    HeaderLeft: TabHeaderLeft,
  },
  [TabRoutesNames.HOME]: {
    name: tabRoutePaths.home,
    Element: (props: ParamListBase) => {
      return (
        <Layout
          isPageScrolling={true}
          deleteBottomPadding={false}
          deleteTopPadding={true}
          isTabBar>
          <HomePage {...props} />
        </Layout>
      );
    },
    headerTitle: '',
    headerShown: true,
    HeaderLeft: HomePageHeaderLeft,
    isHomePage: true,
  },
  [TabRoutesNames.BOOKS]: {
    name: tabRoutePaths.books,
    Element: (props: ParamListBase) => {
      return (
        <Layout
          isPageScrolling={true}
          deleteBottomPadding={false}
          deleteTopPadding={false}
          isTabBar>
          <BooksPage {...props} />
        </Layout>
      );
    },
    headerTitle: 'books.title',
    headerShown: true,
    HeaderLeft: TabHeaderLeft,
  },
  [TabRoutesNames.SHOP]: {
    name: tabRoutePaths.shop,
    Element: (props: ParamListBase) => {
      return (
        <Layout
          isPageScrolling={true}
          deleteBottomPadding={false}
          deleteTopPadding={true}
          isTabBar>
          <ShopPage {...props} />
        </Layout>
      );
    },
    headerTitle: 'shop.title',
    headerShown: true,
    HeaderLeft: TabHeaderLeft,
  },
};
