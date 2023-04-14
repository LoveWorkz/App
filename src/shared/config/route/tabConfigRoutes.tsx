import {ComponentType} from 'react';

import {HomePage} from '@src/pages/HomePage';
import {ChallengesPage} from '@src/pages/ChallengesPage';
import {ShopPage} from '@src/pages/ShopPage';
import {CategoriesPage} from '@src/pages/CategoriesPage';
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
  headerTitle?: string;
  isPageScrolling?: boolean;
  deleteBottomPadding?: boolean;
  deleteTopPadding?: boolean;
};

export const tabRoutesConfig: Record<TabRoutesNames, NewRouteProps> = {
  [TabRoutesNames.CATEGORIES]: {
    name: tabRoutePaths.categories,
    Element: CategoriesPage,
    headerTitle: 'Questions library',
    isPageScrolling: true,
  },
  [TabRoutesNames.CHALLENGES]: {
    name: tabRoutePaths.challenges,
    Element: ChallengesPage,
    headerTitle: 'Challenges',
    isPageScrolling: true,
  },
  [TabRoutesNames.HOME]: {
    name: tabRoutePaths.home,
    Element: HomePage,
    headerTitle: '',
    isPageScrolling: true,
    deleteTopPadding: true,
  },
  [TabRoutesNames.BOOKS]: {
    name: tabRoutePaths.books,
    Element: BooksPage,
    headerTitle: 'Literature',
    isPageScrolling: true,
  },
  [TabRoutesNames.SHOP]: {
    name: tabRoutePaths.shop,
    Element: ShopPage,
    headerTitle: 'Shop',
    isPageScrolling: true,
  },
};
