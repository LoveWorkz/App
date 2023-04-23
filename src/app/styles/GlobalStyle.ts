import {StyleSheet, Dimensions} from 'react-native';

// paddings
export const globalPadding = 20;

// window sizes
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
export const windowWidthMinusPaddings =
  Dimensions.get('window').width - globalPadding - globalPadding;
export const windowWidthHalf = windowWidth / 2;
export const windowHeightHalf = windowHeight / 2;

//fontSizes
export enum FontSizes {
  SIZE_1 = 10,
  SIZE_2 = 12,
  SIZE_3 = 14,
  SIZE_4 = 16,
  SIZE_5 = 18,
  SIZE_6 = 22,
  SIZE_7 = 24,
}

// z-index
export const forgotPasswordZIndex = 1;
export const categoryLayoutZIndex = 1;
export const categoryLayoutIconZIndex = 2;
export const challengeLayoutZIndex = 1;
export const challengeLayoutIconZIndex = 2;

export const globalStyles = StyleSheet.create({
  textFont: {
    fontFamily: 'Quicksand-Bold',
  },
  shadowOpacity: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  strongShadowOpacity: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,

    elevation: 17,
  },
  simpleShadowOpacity: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
});
