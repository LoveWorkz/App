import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const guidelineBaseWidth = 393;
const guidelineBaseHeight = 852;

// use for
// height, marginTop, marginBotton, margin Vertical, line-height,
// paddingTop, paddingBotton, padding Vertical, likewise.
export const horizontalScale = (size: number) =>
  (width / guidelineBaseWidth) * size;

// use for
// width, marginLeft, marginRight, marginHorizontal, paddingLeft
// paddingRight, paddingHorizontal, likewise.
export const verticalScale = (size: number) =>
  (height / guidelineBaseHeight) * size;

// use for
// use for font-size, borderRadius, likewise
export const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;
