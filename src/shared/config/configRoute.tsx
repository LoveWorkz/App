import {ComponentType} from 'react';

import {HomePage} from '@src/pages/HomePage';
import {AuthPage} from '@src/pages/AuthPage';
import {SplashPage} from '@src/pages/SplashPage';

export enum AppRouteNames {
  AUTH = 'auth',
  MAIN = 'main',
  SPLASH = 'splash',
}

export const appRoutePaths: Record<AppRouteNames, string> = {
  [AppRouteNames.AUTH]: 'auth',
  [AppRouteNames.MAIN]: 'main',
  [AppRouteNames.SPLASH]: 'splash',
};

type NewRouteProps = {
  authOnly?: boolean;
  name: string;
  element: ComponentType;
};

export const appRoutesConfig: Record<AppRouteNames, NewRouteProps> = {
  [AppRouteNames.AUTH]: {
    name: appRoutePaths.auth,
    element: AuthPage,
  },
  [AppRouteNames.MAIN]: {
    name: appRoutePaths.main,
    element: HomePage,
  },
  [AppRouteNames.SPLASH]: {
    name: appRoutePaths.splash,
    element: SplashPage,
  },
};
