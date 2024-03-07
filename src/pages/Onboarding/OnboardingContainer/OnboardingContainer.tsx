import React, {memo, ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {windowWidth, globalPadding} from '@src/app/styles/GlobalStyle';
import {verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';

interface OnboardingContainerProps {
  children: ReactElement | ReactElement[];
  bgImage: number;
  imageChildren?: ReactElement;
}

const OnboardingContainer = (props: OnboardingContainerProps) => {
  const {children, bgImage, imageChildren} = props;

  const colors = useColors();

  return (
    <View>
      <View
        style={[
          styles.imgWrapper,
          {backgroundColor: colors.bgOnboardingColor},
        ]}>
        <FastImage resizeMode="cover" source={bgImage} style={styles.bgImg}>
          {imageChildren}
        </FastImage>
        {children}
      </View>
    </View>
  );
};

export default memo(OnboardingContainer);

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
