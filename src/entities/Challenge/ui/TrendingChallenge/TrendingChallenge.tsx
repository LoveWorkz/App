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
import challengeStore from '../../model/store/challengeStore';
import {Theme, useTheme} from '@src/app/providers/themeProvider';

interface TrendingChallengeProps {
  challenge: TrendingChallengeType;
  isLoading: boolean;
}

const borderRadius = moderateScale(20);

const TrendingChallenge = (props: TrendingChallengeProps) => {
  const {challenge, isLoading} = props;

  const {description, title, isChallengeSpecial, group} = challenge;

  const displayName = group?.displayName;

  const colors = useColors();
  const {theme} = useTheme();
  const isDark = theme === Theme.Dark;
  const languae = useLanguage();

  const onChallengePressHandler = () => {
    // setting this flag to avoid going to the final page
    challengeStore.setIsSessionFlow(false);

    if (isChallengeSpecial) {
      challengeStore.specialChallengePressHandler(challenge as any);
    } else {
      challengeStore.coreChallengePressHandler({challenge: challenge as any});
    }
  };

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
    <TouchableOpacity onPress={onChallengePressHandler}>
      <View
        style={[
          styles.TrendingChallenge,
          {backgroundColor: isDark ? colors.bgSecondaryColor : colors.white},
        ]}>
        <FastImage
          style={styles.img}
          resizeMode={'stretch'}
          source={challengeImage}
        />
        <View style={styles.textWrapper}>
          {displayName && (
            <AppText
              style={styles.title}
              weight={'600'}
              size={TextSize.LEVEL_2}
              text={displayName[languae]}
            />
          )}
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
