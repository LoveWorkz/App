import React, {useEffect} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {ActivityIndicator} from 'react-native';
import {observer} from 'mobx-react-lite';

import {AppRoute} from './providers/route/AppRoute';
import {user} from '../entities/User';
import {navigationRef} from '../shared/config/navigation/navigation';
import {AppRouteNames} from '../shared/config/configRoute';

GoogleSignin.configure({
  webClientId:
    '470642156929-4a86lh5s44dthrf439p3l1nrfrt2u56l.apps.googleusercontent.com',
  offlineAccess: true,
});

const App = observer(() => {
  useEffect(() => {
    user.intiAuthUser();
  }, []);

  useEffect(() => {
    if (!user.authUser) {
      return;
    }

    navigationRef.navigate(AppRouteNames.MAIN);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.authUser]);

  if (user?.isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return <AppRoute />;
});

export default App;
