import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {challengeIntroCard} from '@src/shared/assets/images';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {StyledWordText} from '@src/shared/ui/StyledWordText/StyledWordText';
import {globalStyles} from '@src/app/styles/GlobalStyle';
import {StyleType} from '@src/shared/types/types';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

const CoreChallengeIntroCard = () => {
  const colors = useColors();

  const textStyle = useMemo(() => {
    return {color: colors.white};
  }, []);

  const groupName = 'Routines';

  const LetsDoItPressHandler = () => {
    navigation.navigate(AppRouteNames.CORE_CHALLENGE_CARDS, {
      title: groupName,
    });
  };

  return (
    <View style={styles.ChallengeIntroCard}>
      <View style={styles.topPart}>
        <AppText
          style={textStyle}
          size={TextSize.SIZE_24}
          lineHeight={30}
          weight={'700'}
          text={'It’s time for a Routine!'}
        />
      </View>

      <FastImage
        resizeMode="stretch"
        source={challengeIntroCard as number} // image number
        style={styles.cardBg}>
        <View style={styles.cardItem}>
          <View style={styles.title}>
            <AppText
              style={textStyle}
              size={TextSize.LEVEL_5}
              lineHeight={24}
              weight="700"
              text={'Info'}
            />
          </View>
          <AppText
            style={textStyle}
            size={TextSize.LEVEL_4}
            lineHeight={20}
            text={
              'Engaging in joint activities & making beautiful memories are strengthening your bond & enhancing your intimacy to help you build a deeper connection as a couple.'
            }
          />
        </View>
        <View style={styles.title}>
          <AppText
            style={textStyle}
            size={TextSize.LEVEL_5}
            lineHeight={24}
            weight="700"
            text={'Instructions'}
          />
        </View>

        <StyledWordText
          styledWords={['one']}
          styledWordStyle={[styles.styledWordStyle, textStyle]}
          textStyle={[styles.textStyle, textStyle]}
          text={`Choose one of the following ${groupName}, enjoy it together and remember to mark it as completed once you're finished.`}
        />
      </FastImage>

      <Button
        onPress={LetsDoItPressHandler}
        theme={ButtonTheme.NORMAL}
        style={[styles.btn, {backgroundColor: colors.white}]}>
        <GradientText
          size={TextSize.LEVEL_4}
          weight={'600'}
          text={'Hop to the Challenge'}
        />
      </Button>
    </View>
  );
};

export default memo(observer(CoreChallengeIntroCard));

const width = '90%';
const styledWordStyle: StyleType = {
  ...globalStyles.size_4,
  lineHeight: 20,
};

const styles = StyleSheet.create({
  ChallengeIntroCard: {
    flex: 1,
    alignItems: 'center',
  },
  topPart: {
    marginBottom: verticalScale(30),
    alignItems: 'center',
  },
  title: {
    marginBottom: verticalScale(20),
  },
  cardItem: {
    marginBottom: verticalScale(30),
  },
  cardBg: {
    width: width,
    padding: horizontalScale(20),
  },
  btn: {
    position: 'absolute',
    bottom: verticalScale(20),
    width: width,
  },

  styledWordStyle: {
    ...styledWordStyle,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  textStyle: {
    ...styledWordStyle,
  },
});
