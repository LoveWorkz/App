import {StyleSheet, Dimensions} from 'react-native';

export const globalPadding = 15;
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

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
