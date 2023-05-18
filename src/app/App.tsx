import React, {useEffect} from 'react';
import {AppState, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {Toast} from '@src/shared/ui/Toast/Toast';
import {userStore} from '@src/entities/User';
import {initAdmob} from './config/admobConfig';
import {configureGoogleSignin} from './config/firebaseConfig';
import {ColorsProvider} from './providers/colorsProvider';
import {AppRoute} from './providers/route/AppRoute';
import {ThemeProvider} from './providers/themeProvider';

const App = () => {
  useEffect(() => {
    initAdmob();
    configureGoogleSignin();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background') {
        userStore.setFirstUserVisit();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={styles.App}>
      <ThemeProvider>
        <ColorsProvider>
          <AppRoute />
          <Toast />
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
