import {ComponentType} from 'react';

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
    Element: HomePage,
  },
  [TabRoutesNames.CATEGORIES]: {
    name: tabRoutePaths.categories,
    Element: Categories,
  },
  [TabRoutesNames.BOOKS]: {
    name: tabRoutePaths.books,
    Element: BooksPage,
  },
  [TabRoutesNames.CHALLENGES]: {
    name: tabRoutePaths.challenges,
    Element: ChallengesPage,
  },
  [TabRoutesNames.SHOP]: {
    name: tabRoutePaths.shop,
    Element: ShopPage,
  },
};
