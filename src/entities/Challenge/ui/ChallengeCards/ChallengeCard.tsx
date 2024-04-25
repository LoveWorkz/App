import React, {memo, ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {TextSize} from '@src/shared/ui/AppText/AppText';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {HeartsIcon} from '@src/shared/assets/icons/Hearts';
import {CARD_HEIGHT, CARD_WIDTH} from '@src/shared/consts/common';
import {useColors} from '@src/app/providers/colorsProvider';

interface ChallengeCardProps {
  children: ReactElement[] | ReactElement;
  title: string;
}

export const ChallengeCard = (props: ChallengeCardProps) => {
  const {children, title} = props;
  const {theme} = useTheme();
  const colors = useColors();

  return (
    <View
      style={[
        styles.ChallengeCard,
        {
          ...getShadowOpacity(theme).shadowOpacity_level_2,
          backgroundColor: colors.white,
        },
      ]}>
      <GradientText
        style={styles.title}
        size={TextSize.LEVEL_5}
        weight={'700'}
        text={title}
      />
      <View style={styles.iconWrapper}>
        <SvgXml xml={HeartsIcon} width={horizontalScale(60)} height={horizontalScale(60)} />
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

export default memo(ChallengeCard);

const styles = StyleSheet.create({
  ChallengeCard: {
    height: verticalScale(CARD_HEIGHT),
    width: horizontalScale(CARD_WIDTH),
    borderRadius: moderateScale(20),
    paddingHorizontal: horizontalScale(25),
    paddingTop: verticalScale(40),
    overflow: 'hidden',
  },
  title: {
    textTransform: 'uppercase',
  },
  content: {
    marginTop: verticalScale(20),
  },
  iconWrapper: {
    position: 'absolute',
    bottom: verticalScale(-18),
    left: 0,
  },
});
