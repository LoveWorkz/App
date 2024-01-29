import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Toast } from '@src/shared/ui/Toast/Toast';
import { PushNotifications } from '@src/features/PushNotifications';
import { initAdmob } from './config/admobConfig';
import { configureGoogleSignin } from './config/firebaseConfig';
import { ColorsProvider } from './providers/colorsProvider';
import { AppRoute } from './providers/route/AppRoute';
import { ThemeProvider } from './providers/themeProvider';

const App = () => {
  useEffect(() => {
    initAdmob();
    configureGoogleSignin();
  }, []);

  return (
    <GestureHandlerRootView style={styles.App}>
      <ThemeProvider>
        <ColorsProvider>
          <AppRoute />
          <Toast />
          <PushNotifications />
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
