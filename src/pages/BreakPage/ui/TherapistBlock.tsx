import React, {memo, useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useHeaderHeight} from '@react-navigation/elements';

import {useColors} from '@src/app/providers/colorsProvider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Avatar} from '@src/shared/ui/Avatar/Avatar';
import {ArranKennedy} from '@src/shared/assets/images';
import {windowHeight} from '@src/app/styles/GlobalStyle';

const blockHeight = verticalScale(390);

const TherapistBlock = () => {
  const colors = useColors();
  const navbarHeaderHeight = useHeaderHeight();

  const windowHeightMinusNavbarHeight = windowHeight - navbarHeaderHeight;

  const textStyle = useMemo(() => {
    return {color: colors.black};
  }, []);

  // Initial settings for translateY, opacity, and scale
  const translateY = useSharedValue(windowHeightMinusNavbarHeight);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5); // Start at half size for a scale effect

  // Calculate the middle position for the block
  const middlePosition = windowHeightMinusNavbarHeight / 2 - blockHeight / 2;

  // Animated styles for translateY, opacity, and scale
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}, {scale: scale.value}],
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    setTimeout(() => {
      translateY.value = withSpring(middlePosition, {
        damping: 16,
        stiffness: 150,
      });
      opacity.value = withTiming(1, {
        // Fade in to fully visible
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
      scale.value = withSpring(1, {
        // Animate scale to normal size
        damping: 15,
        stiffness: 150,
      });
    }, 500);
  }, []);

  return (
    <Animated.View
      style={[
        styles.TherapistBlock,
        animatedStyles,
        {backgroundColor: colors.white},
      ]}>
      <View style={styles.topBlock}>
        <View style={styles.avatarWrapper}>
          <Avatar size={60} imageNumber={ArranKennedy} />
        </View>
        <AppText weight="900" size={TextSize.LEVEL_5} text={'Arran Kennedy'} />
      </View>
      <View style={styles.text}>
        <AppText style={textStyle} size={TextSize.LEVEL_4} text={'Nice Job,'} />
      </View>

      <View style={styles.text}>
        <AppText
          style={textStyle}
          size={TextSize.LEVEL_4}
          text={
            'Take a little break and talk about what you liked and disliked. Which questions did you find difficult and which were easy? Why?'
          }
        />
      </View>
      <View style={[styles.text, styles.textStop]}>
        <AppText
          style={textStyle}
          size={TextSize.LEVEL_4}
          text={'Next Stop: '}
        />
        <AppText
          style={textStyle}
          size={TextSize.LEVEL_4}
          weight={'700'}
          text={'Challenges*'}
        />
      </View>

      <View style={styles.text}>
        <AppText
          style={textStyle}
          size={TextSize.LEVEL_2}
          text={
            '*Each Session concludes with a challenge—think of it as homework or a tool—designed to translate insights into action.'
          }
        />
      </View>
    </Animated.View>
  );
};

export default memo(TherapistBlock);

const styles = StyleSheet.create({
  TherapistBlock: {
    width: '100%',
    position: 'absolute',
    height: blockHeight,
    left: 0,
    right: 0,
    borderRadius: moderateScale(20),
    paddingHorizontal: horizontalScale(40),
    justifyContent: 'center',
  },
  topBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    marginRight: horizontalScale(10),
  },
  text: {
    marginTop: verticalScale(20),
  },
  textStop: {
    flexDirection: 'row',
  },
});
