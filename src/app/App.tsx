import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {Toast} from '@src/shared/ui/Toast/Toast';
import {PushNotifications} from '@src/features/PushNotifications';
// import {initAdmob} from './config/admobConfig';
import {configureGoogleSignin} from './config/firebaseConfig';
import {ColorsProvider} from './providers/colorsProvider';
import {AppRoute} from './providers/route/AppRoute';
import {ThemeProvider} from './providers/themeProvider';
import {GradientProvider} from './providers/GradientProvider';
import * as Sentry from '@sentry/react-native';

const App = () => {
  useEffect(() => {
    // initAdmob();
    configureGoogleSignin();
  }, []);

  const routingInstrumentation = new Sentry.ReactNavigationInstrumentation({
    enableTimeToInitialDisplay: true,
  });

  Sentry.init({
    dsn: 'https://1a830a2fba85e78cabee0f5223294936@o4507543721213952.ingest.de.sentry.io/4507543724163152',
    integrations: [new Sentry.ReactNativeTracing({routingInstrumentation})],
    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // enableSpotlight: __DEV__,
  });

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
