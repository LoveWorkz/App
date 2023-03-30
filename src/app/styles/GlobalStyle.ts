import {StyleSheet, Dimensions} from 'react-native';

// paddings
export const globalPadding = 15;

// window sizes
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

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

export default StyleSheet.create({
  textFont: {
    fontFamily: 'Quicksand-Bold',
  },
  shadowOpacity: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
});
