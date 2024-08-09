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
import {windowHeight} from '@src/app/styles/GlobalStyle';
import {ArranKennedyBlock} from '@src/shared/ui/ArranKennedyBlock/ArranKennedyBlock';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@src/app/providers/themeProvider';

const blockHeight = verticalScale(390);

const TherapistBlock = () => {
  const colors = useColors();
  const navbarHeaderHeight = useHeaderHeight();
  const {t} = useTranslation();
  const {isDark} = useTheme();

  const windowHeightMinusNavbarHeight = windowHeight - navbarHeaderHeight;

  const textStyle = useMemo(() => {
    return {color: isDark ? colors.whisperWhite : colors.black};
  }, [colors.black, colors.whisperWhite, isDark]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        styles.TherapistBlock,
        animatedStyles,
        {backgroundColor: isDark ? colors.bgTertiaryColor : colors.white},
      ]}>
      <ArranKennedyBlock />
      <View style={styles.text}>
        <AppText
          style={textStyle}
          size={TextSize.LEVEL_4}
          text={t('common.nice_job_single_phrase')}
        />
      </View>

      <View style={styles.text}>
        <AppText
          style={textStyle}
          size={TextSize.LEVEL_4}
          text={t('common.nice_job_single_phrase_part_2')}
        />
      </View>
      <View style={[styles.text, styles.textStop]}>
        <AppText
          style={textStyle}
          size={TextSize.LEVEL_4}
          text={t('common.next_stop_challenges_part_1')}
        />
        <AppText
          style={textStyle}
          size={TextSize.LEVEL_4}
          weight={'700'}
          text={t('common.next_stop_challenges_part_2')}
        />
      </View>

      <View style={styles.text}>
        <AppText
          style={textStyle}
          size={TextSize.LEVEL_2}
          text={t('common.each_session_future_action')}
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

  text: {
    marginTop: verticalScale(20),
  },
  textStop: {
    flexDirection: 'row',
  },
});
