import {StyleSheet} from 'react-native';
import {verticalScale} from '@src/shared/lib/Metrics';

export const onboardingWidth = '90%';

export const onboardingStyles = StyleSheet.create({
  Page: {
    flex: 1,
    alignItems: 'center',
  },
  bottomSide: {
    position: 'absolute',
    bottom: verticalScale(20),
    width: '100%',
    alignItems: 'center',
  },
  btnWrapper: {
    width: onboardingWidth,
  },
});
