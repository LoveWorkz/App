import React, {memo, ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';

import {TextSize} from '@src/shared/ui/AppText/AppText';
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
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {SvgXml} from 'react-native-svg';
import {HeartsIcon} from '@src/shared/assets/icons/Hearts';
import {APPLICATION_NAME} from '@src/app/config/appConfig';

interface ChallengeCardProps {
  children: ReactElement[] | ReactElement;
  title: string;
}

export const ChallengeCard = (props: ChallengeCardProps) => {
  const {children, title} = props;
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.ChallengeCard,
        {...getShadowOpacity(theme).shadowOpacity_level_2},
      ]}>
      <View style={styles.iconWrapper}>
        <SvgXml xml={HeartsIcon} height={18} />
      </View>
      <GradientText
        style={styles.title}
        size={TextSize.LEVEL_5}
        weight={'700'}
        text={title}
      />
      <View style={styles.content}>{children}</View>
      <View style={styles.projectName}>
        <GradientText
          size={TextSize.LEVEL_2}
          weight={'700'}
          text={`...${APPLICATION_NAME}`}
        />
      </View>
    </View>
  );
};

export default memo(ChallengeCard);

const styles = StyleSheet.create({
  ChallengeCard: {
    height: windowHeight * 0.75,
    width: windowWidth * 0.88,
    borderRadius: moderateScale(20),
    paddingHorizontal: horizontalScale(25),
    backgroundColor: 'white',
    paddingTop: verticalScale(40),
  },
  title: {
    textTransform: 'uppercase',
  },
  content: {
    marginTop: verticalScale(20),
  },
  iconWrapper: {
    left: 130,
    bottom: 20,
  },
  projectName: {
    position: 'absolute',
    bottom: horizontalScale(20),
    right: horizontalScale(20),
  },
});
