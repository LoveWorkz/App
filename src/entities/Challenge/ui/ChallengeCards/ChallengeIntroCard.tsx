import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {
  getShadowOpacity,
  windowHeight,
  windowWidth,
} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import {challengeIntroCard} from '@src/shared/assets/images';
import {useColors} from '@src/app/providers/colorsProvider';

interface ChallengeIntroCardProps {
  title: string;
  description: string;
  description2?: string;
  description3?: string;
}

export const ChallengeIntroCard = (props: ChallengeIntroCardProps) => {
  const {title, description, description2, description3} = props;
  const {theme} = useTheme();

  const colors = useColors();

  const isDescriptionLarge = description2;

  return (
    <View style={{...getShadowOpacity(theme).shadowOpacity_level_2}}>
      <FastImage
        resizeMode="stretch"
        source={challengeIntroCard as number} // image number
        style={styles.ChallengeIntroCard}>
        <View style={{marginTop: verticalScale(isDescriptionLarge ? 80 : 200)}}>
          <AppText
            align="justify"
            style={[styles.title, {color: colors.primaryTextColor}]}
            weight={'700'}
            size={TextSize.LEVEL_5}
            text={title}
          />
          <View>
            <AppText
              align="justify"
              style={[styles.description, {color: colors.primaryTextColor}]}
              weight={'500'}
              size={TextSize.LEVEL_4}
              text={description}
            />
            {description2 && (
              <AppText
                style={[styles.description, {color: colors.primaryTextColor}]}
                weight={'500'}
                size={TextSize.LEVEL_4}
                text={description2}
              />
            )}
            {description3 && (
              <AppText
                style={{color: colors.primaryTextColor}}
                weight={'500'}
                size={TextSize.LEVEL_4}
                text={description3}
              />
            )}
          </View>
        </View>
      </FastImage>
    </View>
  );
};

export default memo(observer(ChallengeIntroCard));

const styles = StyleSheet.create({
  ChallengeIntroCard: {
    height: windowHeight * 0.75,
    width: windowWidth * 0.88,
    borderRadius: moderateScale(20),
    paddingHorizontal: horizontalScale(25),
  },
  title: {
    marginBottom: verticalScale(15),
  },
  description: {
    marginBottom: verticalScale(10),
  },
});
