import React, {ComponentType} from 'react';
import {ParamListBase} from '@react-navigation/native';

import {HomePage} from '@src/pages/HomePage';
import {ChallengesPage} from '@src/pages/ChallengesPage';
import {CategoriesPage} from '@src/pages/CategoriesPage';
import {BooksPage} from '@src/pages/BooksPage';
import {TabHeaderLeft} from '@src/widgets/headers/TabHeaderLeft';
import {Layout} from '@src/widgets/layout';
import {TabName} from '@src/shared/types/types';
import {RubricsPage} from '@src/pages/RubricsPage';

export enum TabRoutesNames {
  HOME = 'home',
  CATEGORIES = 'categories',
  BOOKS = 'books',
  CHALLENGES = 'challenges',
  RUBRICS = 'rubrics',
}

export const tabRoutePaths: Record<TabRoutesNames, string> = {
  [TabRoutesNames.HOME]: 'home',
  [TabRoutesNames.CATEGORIES]: 'categories',
  [TabRoutesNames.BOOKS]: 'books',
  [TabRoutesNames.CHALLENGES]: 'challenges',
  [TabRoutesNames.RUBRICS]: 'rubrics',
};

type NewRouteProps = {
  authOnly?: boolean;
  name: string;
  Element: ComponentType;
  headerTitle?: string;
  headerShown?: boolean;
  HeaderLeft?: ComponentType<any>;
  isHomePage?: boolean;
  tabName: TabName;
};

export const tabRoutesConfig: Record<TabRoutesNames, NewRouteProps> = {
  [TabRoutesNames.CATEGORIES]: {
    name: tabRoutePaths.categories,
    tabName: 'Categories',
    Element: (props: ParamListBase) => {
      return (
        <Layout isPageScrolling={true} isTabBar>
          <CategoriesPage {...props} />
        </Layout>
      );
    },
    headerTitle: 'sessions.sessions',
    headerShown: true,
    HeaderLeft: TabHeaderLeft,
  },
  [TabRoutesNames.RUBRICS]: {
    name: tabRoutePaths.rubrics,
    tabName: 'Rubrics',
    Element: (props: ParamListBase) => {
      return (
        <Layout isPageScrolling={true} isTabBar>
          <RubricsPage {...props} />
        </Layout>
      );
    },
    headerTitle: 'questions.title',
    headerShown: true,
    HeaderLeft: TabHeaderLeft,
  },
  [TabRoutesNames.CHALLENGES]: {
    name: tabRoutePaths.challenges,
    tabName: 'Challenges',
    Element: (props: ParamListBase) => {
      return (
        <Layout
          isPageScrolling={false}
          deleteBottomPadding={false}
          deleteTopPadding={true}
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
    tabName: 'Home',
    Element: (props: ParamListBase) => {
      return (
        <Layout deleteBottomPadding={false} deleteTopPadding={true} isTabBar>
          <HomePage {...props} />
        </Layout>
      );
    },
    headerTitle: '',
    headerShown: false,
    isHomePage: true,
  },
  [TabRoutesNames.BOOKS]: {
    name: tabRoutePaths.books,
    tabName: 'Books',
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
};
