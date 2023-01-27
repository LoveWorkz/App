/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/app/App';
import {name as appName} from './app.json';
import '@src/shared/config/i18next/i18next';

AppRegistry.registerComponent(appName, () => App);
