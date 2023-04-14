import {
  createNavigationContainerRef,
  StackActions,
  CommonActions,
  NavigationContainerRefWithCurrent,
  ParamListBase,
} from '@react-navigation/native';

type RootStackParamList = {
  Home?: undefined;
  Profile?: {userId: string};
  Feed?: {sort: 'latest' | 'top'} | undefined;
  id?: string;
  title?: string;
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
    navigationRef.navigate(name, params);
  }
};

const replace = (name: string, params?: RootStackParamList) => {
  if (navigationRef.isReady()) {
    navigationRef.current?.dispatch(StackActions.replace(name, params));
  }
};

const goBack = () => {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
};

const resetHistoryAndNavigate = (name: string) => {
  if (navigationRef.isReady()) {
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
  }
};

export const navigation: Navigation = {
  navigate,
  replace,
  resetHistoryAndNavigate,
  navigationRef,
  goBack,
};
