import React, {ComponentType} from 'react';

import {Layout} from '@src/app/ui/layout';
import {HomePage} from '@src/pages/HomePage';
import {ChallengesPage} from '@src/pages/ChallengesPage';
import {ShopPage} from '@src/pages/ShopPage';
import {Categories} from '@src/pages/CategoriesPage';
import {BooksPage} from '@src/pages/BooksPage';

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
};

export const tabRoutesConfig: Record<TabRoutesNames, NewRouteProps> = {
  [TabRoutesNames.HOME]: {
    name: tabRoutePaths.home,
    Element: props => (
      <Layout {...props}>
        <HomePage {...props} />
      </Layout>
    ),
  },
  [TabRoutesNames.CATEGORIES]: {
    name: tabRoutePaths.categories,
    Element: props => (
      <Layout {...props}>
        <Categories {...props} />
      </Layout>
    ),
  },
  [TabRoutesNames.BOOKS]: {
    name: tabRoutePaths.books,
    Element: props => (
      <Layout {...props}>
        <BooksPage {...props} />
      </Layout>
    ),
  },
  [TabRoutesNames.CHALLENGES]: {
    name: tabRoutePaths.challenges,
    Element: props => (
      <Layout {...props}>
        <ChallengesPage {...props} />
      </Layout>
    ),
  },
  [TabRoutesNames.SHOP]: {
    name: tabRoutePaths.shop,
    Element: props => (
      <Layout {...props}>
        <ShopPage {...props} />
      </Layout>
    ),
  },
};
