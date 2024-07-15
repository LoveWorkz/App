import React from 'react';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {Toast} from '@src/shared/ui/Toast/Toast';
import {PushNotifications} from '@src/features/PushNotifications';
import {ColorsProvider} from './providers/colorsProvider';
import {AppRoute} from './providers/route/AppRoute';
import {ThemeProvider} from './providers/themeProvider';
import {GradientProvider} from './providers/GradientProvider';
import * as Sentry from '@sentry/react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const App = () => {
  // TODO: enable Admob
  // useEffect(() => {
  //   // initAdmob();
  // }, []);

  const routingInstrumentation = new Sentry.ReactNavigationInstrumentation({
    enableTimeToInitialDisplay: true,
  });

  GoogleSignin.configure({
    webClientId:
      '470642156929-4a86lh5s44dthrf439p3l1nrfrt2u56l.apps.googleusercontent.com',
    offlineAccess: true,
  });

  if (!__DEV__) {
    Sentry.init({
      dsn: 'https://1a830a2fba85e78cabee0f5223294936@o4507543721213952.ingest.de.sentry.io/4507543724163152',
      integrations: [new Sentry.ReactNativeTracing({routingInstrumentation})],
    });
  }

  return (
    <GestureHandlerRootView style={styles.App}>
      <ThemeProvider>
        <ColorsProvider>
          <GradientProvider>
            <AppRoute routingInstrumentation={routingInstrumentation} />
            <Toast />
            <PushNotifications />
          </GradientProvider>
        </ColorsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  App: {
    flex: 1,
  },
});

export default App;
