import {Platform} from 'react-native';
import {windowHeight, windowWidth} from '@src/app/styles/GlobalStyle';

export const SPLASH_PAGE_DURATION = 2000;
export const isPlatformIos = Platform.OS === 'ios';
export const CARD_HEIGHT = 520;
export const CARD_HEIGHT_SPECIAL = windowHeight * 0.6;
export const CARD_WIDTH = windowWidth * 0.77;
export const DEFAULT_INFORMATION_POPUP_WIDTH = 280;
export const HEADER_HEIGHT_IOS = 100;
export const HEADER_HEIGHT_ADNDROID = 60;
export const HEADER_HEIGHT = isPlatformIos
  ? HEADER_HEIGHT_IOS
  : HEADER_HEIGHT_ADNDROID;
