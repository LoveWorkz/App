import React from 'react';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {Toast} from '@src/shared/ui/Toast/Toast';
import {PushNotifications} from '@src/features/PushNotifications';
import {ColorsProvider} from './providers/colorsProvider';
import {AppRoute} from './providers/route/AppRoute';
import {ThemeProvider} from './providers/themeProvider';
import {GradientProvider} from './providers/GradientProvider';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import { Notification } from '@src/widgets/Notification';

const App = () => {
  // TODO: enable Admob
  // useEffect(() => {
  //   // initAdmob();
  // }, []);

  GoogleSignin.configure({
    webClientId:
      '470642156929-4a86lh5s44dthrf439p3l1nrfrt2u56l.apps.googleusercontent.com',
    offlineAccess: true,
  });

  return (
    <GestureHandlerRootView style={styles.App}>
      <ThemeProvider>
        <ColorsProvider>
          <GradientProvider>
            <AppRoute />
            <Toast />
            <PushNotifications />
            <Notification />
          </GradientProvider>
        </ColorsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  App: {
    flex: 1,
  },
});