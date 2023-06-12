import {
  createNavigationContainerRef,
  StackActions,
  CommonActions,
  NavigationContainerRefWithCurrent,
  ParamListBase,
} from '@react-navigation/native';
import {DocumentType} from '@src/shared/types/types';

type RootStackParamList = {
  Home?: undefined;
  Profile?: {userId: string};
  Feed?: {sort: 'latest' | 'top'} | undefined;
  id?: string;
  initialQuestionId?: string;
  title?: string;
  type?: DocumentType;
  isTabScreen?: boolean;
};

export interface Navigation {
  navigate: (name: string, params?: RootStackParamList) => void;
  replace: (name: string, params?: RootStackParamList) => void;
  resetHistoryAndNavigate: (name: string) => void;
  navigationRef: NavigationContainerRefWithCurrent<ParamListBase>;
  goBack: () => void;
}

const navigationRef = createNavigationContainerRef<ParamListBase>();

const navigate = (name: string, params?: RootStackParamList) => {
  if (navigationRef.isReady()) {
    const currentRoute = navigationRef.getCurrentRoute();

    navigationRef.navigate(name, {
      ...params,
      prevRouteName: currentRoute ? currentRoute.name : '',
      isTabScreen: params?.isTabScreen || false,
    });
  }
};

const replace = (name: string, params?: RootStackParamList) => {
  if (navigationRef.isReady()) {
    const currentRoute = navigationRef.getCurrentRoute();

    navigationRef.current?.dispatch(
      StackActions.replace(name, {
        ...params,
        prevRouteName: currentRoute ? currentRoute.name : '',
        isTabScreen: params?.isTabScreen || false,
      }),
    );
  }
};

const goBack = () => {
  if (navigationRef.isReady()) {
    const currentRoute = navigationRef.getCurrentRoute();

    navigationRef.goBack();
    navigationRef.setParams({
      prevRouteName: currentRoute ? currentRoute.name : '',
      isTabScreen: false,
    });
  }
};

const resetHistoryAndNavigate = (name: string) => {
  if (navigationRef.isReady()) {
    const currentRoute = navigationRef.getCurrentRoute();

    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name,
          },
        ],
      }),
    );
    navigationRef.setParams({
      prevRouteName: currentRoute ? currentRoute.name : '',
      isTabScreen: false,
    });
  }
};

export const navigation: Navigation = {
  navigate,
  replace,
  resetHistoryAndNavigate,
  navigationRef,
  goBack,
};
