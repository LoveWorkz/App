/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/app/App';
import {name as appName} from './app.json';
import '@src/shared/config/i18next/i18next';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { pressAction } = detail;

  // Check if the user pressed the "Mark as read" action
  if (type === EventType.ACTION_PRESS && pressAction.id === 'default') {
   
  }
});


AppRegistry.registerComponent(appName, () => App);