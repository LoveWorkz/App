import React, {memo} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';
import {challengeImage} from '@src/shared/assets/images';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {windowWidthMinusPaddings} from '@src/app/styles/GlobalStyle';
import {TrendingChallengeType} from '../../model/types/ChallengeTypes';

interface TrendingChallengeProps {
  challenge: TrendingChallengeType;
  isLoading: boolean;
}

const borderRadius = moderateScale(20);

const TrendingChallenge = (props: TrendingChallengeProps) => {
  const {
    challenge: {
      description,
      title,
      isChallengeSpecial,
      group: {displayName},
    },
    isLoading,
  } = props;

  const colors = useColors();
  const languae = useLanguage();

  if (isLoading) {
    return (
      <View>
        <Skeleton
          height={horizontalScale(100)}
          width={windowWidthMinusPaddings}
          borderRadius={borderRadius}
        />
      </View>
    );
  }

  return (
    <TouchableOpacity>
      <View style={[styles.TrendingChallenge, {backgroundColor: colors.white}]}>
        <FastImage
          style={styles.img}
          resizeMode={'stretch'}
          source={challengeImage}
        />
        <View style={styles.textWrapper}>
          <AppText
            style={styles.title}
            weight={'600'}
            size={TextSize.LEVEL_2}
            text={displayName[languae]}
          />
          <AppText
            weight={'600'}
            text={isChallengeSpecial ? title[languae] : description[languae]}
            size={TextSize.LEVEL_4}
            numberOfLines={2}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(TrendingChallenge);

const padding = horizontalScale(15);

const styles = StyleSheet.create({
  TrendingChallenge: {
    flexDirection: 'row',
    borderRadius,
    padding,
    alignItems: 'center',
  },
  img: {
    height: horizontalScale(70),
    width: horizontalScale(70),
    left: -5,
  },
  textWrapper: {
    width: horizontalScale(220),
  },
  title: {
    width: '75%',
    marginBottom: horizontalScale(4),
  },
});
