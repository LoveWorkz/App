import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {windowWidth, globalPadding} from '@src/app/styles/GlobalStyle';
import {verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';

interface OnboardingContainerProps {
  children: ReactElement | ReactElement[];
  bgImage: number;
  imageChildren?: ReactElement;
  isNotification?: boolean;
}

const OnboardingContainer = (props: OnboardingContainerProps) => {
  const {children, bgImage, imageChildren, isNotification = false} = props;

  const colors = useColors();

  return (
    <View>
      <View
        style={[
          styles.imgWrapper,
          {backgroundColor: colors.bgOnboardingColor, left: isNotification ? -globalPadding : 0},
        ]}>
        <FastImage resizeMode="cover" source={bgImage} style={styles.bgImg}>
          {imageChildren}
        </FastImage>
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
});
