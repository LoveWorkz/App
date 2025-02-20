import {moderateScale} from '@src/shared/lib/Metrics';
import {StyleSheet, Dimensions, Platform} from 'react-native';

import {Theme} from '../providers/themeProvider';

// paddings
export const globalPadding = 20;

// window sizes
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
export const windowWidthMinusPaddings =
  windowWidth - globalPadding - globalPadding;
export const windowHeightMinusPaddings =
  windowHeight - globalPadding - globalPadding;
export const windowWidthHalf = windowWidth / 2;
export const windowHeightHalf = windowHeight / 2;

// heights
export const tabBarHeight = 90;

export const getShadowOpacity = (theme: Theme, color?: string) => {
  if (theme === Theme.Dark) {
    return {
      shadowOpacity_level_1: {
        ...globalStyles.shadowOpacity_level_1,
        shadowColor: 'rgb(66, 76, 104)',
        backgroundColor: color,
      },

      shadowOpacity_level_2: {
        ...globalStyles.shadowOpacity_level_2,
        shadowColor: 'rgb(66, 76, 104)',
        backgroundColor: color,
      },
      shadowOpacity_level_3: {
        ...globalStyles.shadowOpacity_level_3,
        shadowColor: 'rgb(66, 76, 104)',
        backgroundColor: color,
      },
    };
  }

  return {
    shadowOpacity_level_1: {
      ...globalStyles.shadowOpacity_level_1,
      shadowColor: '#767672',
      backgroundColor: color,
    },

    shadowOpacity_level_2: {
      ...globalStyles.shadowOpacity_level_2,
      shadowColor: '#767672',
      backgroundColor: color,
    },
    shadowOpacity_level_3: {
      ...globalStyles.shadowOpacity_level_3,
      shadowColor: '#767672',
      backgroundColor: color,
    },
  };
};

export const globalStyles = StyleSheet.create({
  Quicksand_Regular: {
    fontFamily:
      Platform.OS === 'ios' ? 'Quicksand-Regular' : 'QuicksandRegular',
  },
  Quicksand_SemiBold: {
    fontFamily:
      Platform.OS === 'ios' ? 'Quicksand-SemiBold' : 'QuicksandSemiBold',
  },
  // Quicksand_SemiBold: Platform.select({
  //   android: {
  //     fontFamily: 'QuicksandSemiBold',
  //   },
  //   ios: {
  //     fontFamily: 'Quicksand-SemiBold',
  //     fontWeight: '700',
  //   },
  // }),

  // z-index
  zIndex_1: {
    zIndex: 1,
  },
  forgotPasswordZIndex: {
    zIndex: 1,
  },
  categoryLayoutZIndex: {
    zIndex: 1,
  },
  categoryLayoutIconZIndex: {
    zIndex: 2,
  },
  challengeLayoutZIndex: {
    zIndex: 1,
  },
  challengeLayoutIconZIndex: {
    zIndex: 2,
  },
  slideItemZindex: {
    zIndex: 1,
  },
  subscriptionPercentageZIndex: {
    zIndex: 1,
  },
  modalCloseIconZIndex: {
    zIndex: 2,
  },
  inputStartIconZIndex: {
    zIndex: 2,
  },
  statisticButtonZIndex: {
    zIndex: 2,
  },

  //font Sizes
  size_1: {
    fontSize: moderateScale(10),
  },
  size_2: {
    fontSize: moderateScale(12),
  },
  size_3: {
    fontSize: moderateScale(14),
  },
  size_4: {
    fontSize: moderateScale(16),
  },
  size_5: {
    fontSize: moderateScale(18),
  },
  size_6: {
    fontSize: moderateScale(22),
  },
  size_7: {
    fontSize: moderateScale(26),
  },
  size_8: {
    fontSize: moderateScale(28),
  },
  size_9: {
    fontSize: moderateScale(34),
  },
  size_48: {
    fontSize: moderateScale(48),
  },
  size_24: {
    fontSize: moderateScale(24),
  },
  size_32: {
    fontSize: moderateScale(32),
  },
  size_38: {
    fontSize: moderateScale(38),
  },
  size_68: {
    fontSize: moderateScale(68),
  },

  // shadow light
  shadowOpacity_level_1: {
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    backgroundColor: 'transparent',
    elevation: 1,
  },
  shadowOpacity_level_2: {
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    backgroundColor: 'transparent',

    elevation: 4,
  },
  shadowOpacity_level_3: {
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    backgroundColor: 'transparent',

    elevation: 17,
  },
});
