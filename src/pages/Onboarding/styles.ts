import {StyleSheet} from 'react-native';

import {verticalScale} from '@src/shared/lib/Metrics';
import { isPlatformIos } from '@src/shared/consts/common';

export const onboardingWidth = '90%';

const bottom = verticalScale(isPlatformIos ? 15 : 5);

export const onboardingStyles = StyleSheet.create({
  Page: {
    flex: 1,
    alignItems: 'center',
  },
  bottomSide: {
    position: 'absolute',
    bottom,
    width: '100%',
    alignItems: 'center',
  },
  btnWrapper: {
    width: onboardingWidth,
  },
  onboardingTop: {
    top: verticalScale(-40),
  }
});
