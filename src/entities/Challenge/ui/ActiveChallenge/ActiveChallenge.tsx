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
import {ActiveChallengeType, TrendingChallengeType} from '../../model/types/ChallengeTypes';
import challengeStore from '../../model/store/challengeStore';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import { DisplayText } from '@src/shared/types/types';

interface TrendingChallengeProps {
  challenge: ActiveChallengeType;
  isLoading: boolean;
}

const borderRadius = moderateScale(20);

const TrendingChallenge = (props: TrendingChallengeProps) => {
  const {challenge, isLoading} = props;

  const {description, title, isChallengeSpecial} = challenge;
  
  let desc;

  if(Array.isArray(description)) {
    desc = description[0] as DisplayText
  } else {
    desc =  description
  }

  const colors = useColors();
  const {theme} = useTheme();
  const isDark = theme === Theme.Dark;
  const languae = useLanguage();

  const onChallengePressHandler = () => {
    // setting this flag to avoid going to the final page
    challengeStore.setIsSessionFlow(false);

    if (isChallengeSpecial) {
      console.log('MTAV');
      
      challengeStore.specialChallengePressHandler({
        specialChallenge: challenge,
      } as any);
    } else {
      console.log('MTAV222');
      
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
          <AppText
            weight={'700'}
            text={title[languae]}
            size={TextSize.LEVEL_3}
            numberOfLines={1}
          />
           {description && (
            <AppText
              style={styles.description}
              weight={'400'}
              size={TextSize.LEVEL_4}
              text={desc[languae]}
              numberOfLines={2}
            />
          )}
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
  description: {
    width: '90%',
    marginTop: horizontalScale(4),
    marginBottom: horizontalScale(4),
  },
});