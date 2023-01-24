import {ComponentType} from 'react';

import {HomePage} from '@src/pages/HomePage';
import {AuthPage} from '@src/pages/AuthPage';
import {SplashPage} from '@src/pages/SplashPage';
import {ResetPasswordPage} from '@src/pages/ResetPasswordPage';

export enum AppRouteNames {
  AUTH = 'auth',
  MAIN = 'main',
  SPLASH = 'splash',
  RESET_PASSWORD = 'reset_password',
}

export const appRoutePaths: Record<AppRouteNames, string> = {
  [AppRouteNames.AUTH]: 'auth',
  [AppRouteNames.MAIN]: 'main',
  [AppRouteNames.SPLASH]: 'splash',
  [AppRouteNames.RESET_PASSWORD]: 'reset_password',
};

type NewRouteProps = {
  authOnly?: boolean;
  name: string;
  Element: ComponentType;
};

export const appRoutesConfig: Record<AppRouteNames, NewRouteProps> = {
  [AppRouteNames.AUTH]: {
    name: appRoutePaths.auth,
    Element: AuthPage,
  },
  [AppRouteNames.MAIN]: {
    name: appRoutePaths.main,
    Element: HomePage,
  },
  [AppRouteNames.SPLASH]: {
    name: appRoutePaths.splash,
    Element: SplashPage,
  },
  [AppRouteNames.RESET_PASSWORD]: {
    name: appRoutePaths.reset_password,
    Element: ResetPasswordPage,
  },
};
