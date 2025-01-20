import React, { useEffect } from 'react';
import {Platform, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {Toast} from '@src/shared/ui/Toast/Toast';
import {PushNotifications} from '@src/features/PushNotifications';
import {ColorsProvider} from './providers/colorsProvider';
import {AppRoute} from './providers/route/AppRoute';
import {ThemeProvider} from './providers/themeProvider';
import {GradientProvider} from './providers/GradientProvider';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import notifee, { AndroidImportance } from '@notifee/react-native';

async function ensureNotificationChannelExists() {
  if (Platform.OS === 'android') {
    // Get the list of all channels
    const channels = await notifee.getChannels();

    // Check if the "default" channel exists
    const channelExists = channels.some(channel => channel.id === 'default');

    if (!channelExists) {
      // Create the channel if it doesn't exist
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
      console.log('Default channel created');
    } else {
      console.log('Default channel already exists');
    }
  }
}

const App = () => {
  useEffect(() => {
    ensureNotificationChannelExists();
  }, []);
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