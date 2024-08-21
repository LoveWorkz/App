import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {windowWidth, globalPadding} from '@src/app/styles/GlobalStyle';
import {verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '@src/app/providers/themeProvider';

interface OnboardingContainerProps {
  children: ReactElement | ReactElement[];
  bgImage: number;
  imageChildren?: ReactElement;
  isNotification?: boolean;
}

const OnboardingContainer = (props: OnboardingContainerProps) => {
  const {children, bgImage, imageChildren, isNotification = false} = props;
  const {isDark} = useTheme();
  const colors = useColors();

  const gradientColors = isDark
    ? ['#323233', colors.bgQuinaryColor, colors.bgQuinaryColor]
    : ['#FBFCFF', '#F4F6FA', '#F4F6FA'];

  return (
    <View>
      <View
        style={[
          styles.imgWrapper,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            backgroundColor: colors.bgOnboardingColor,
            left: isNotification ? -globalPadding : 0,
          },
        ]}>
        <FastImage resizeMode="cover" source={bgImage} style={[styles.bgImg]}>
          {imageChildren}
        </FastImage>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            position: 'absolute',
            top: 0,
            height: '100%',
            width: '100%',
            backgroundColor: isDark ? 'black' : 'transparent',
            opacity: 0.8,
          }}
        />
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          colors={gradientColors}
          style={styles.linearGradient}
        />
        {children}
      </View>
    </View>
  );
};

export default OnboardingContainer;

const styles = StyleSheet.create({
  imgWrapper: {
    height: verticalScale(690),
    width: windowWidth,
    top: -globalPadding,
    alignItems: 'center',
  },
  bgImg: {
    width: '100%',
    height: verticalScale(520),
    alignItems: 'center',
  },
  linearGradient: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    height: 30,
  },
});
