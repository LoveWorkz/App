import {ComponentType} from 'react';

import {HomePage} from '../../pages/HomePage';
import {AuthPage} from '../../pages/AuthPage';

export enum AppRouteNames {
  AUTH = 'auth',
  MAIN = 'main',
}

export const appRoutePaths: Record<AppRouteNames, string> = {
  [AppRouteNames.AUTH]: 'auth',
  [AppRouteNames.MAIN]: 'main',
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
};
