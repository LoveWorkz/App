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
      dsn: 'https://9f5d3ef55c477481ad80671d86731583@o4507470205616128.ingest.de.sentry.io/4508003901505616',
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

export default App;

const styles = StyleSheet.create({
  App: {
    flex: 1,
  },
});
