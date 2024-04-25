import {Platform} from 'react-native';
import {windowWidth} from '@src/app/styles/GlobalStyle';

export const SPLASH_PAGE_DURATION = 2000;
export const isPlatformIos = Platform.OS === 'ios';
export const CARD_HEIGHT = 550;
export const CARD_WIDTH = windowWidth * 0.77;
