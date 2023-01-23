import {createNavigationContainerRef} from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Profile: {userId: string};
  Feed: {sort: 'latest' | 'top'} | undefined;
};

export const navigationRef = createNavigationContainerRef<any>();
export const navigate = (name: string, params?: RootStackParamList) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};
