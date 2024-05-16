import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {CARD_HEIGHT, CARD_WIDTH} from '@src/shared/consts/common';
import {useColors} from '@src/app/providers/colorsProvider';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {questionImage1} from '@src/shared/assets/images';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {APPLICATION_NAME} from '@src/app/config/appConfig';

interface ChallengeCardProps {
  showButton: boolean;
  isSelectingSpecialChallenge: boolean;
}

const CoreChallengeCard = (props: ChallengeCardProps) => {
  const {showButton, isSelectingSpecialChallenge} = props;
  const colors = useColors();

  const onPressHandler = () => {};

  return (
    <FastImage
      resizeMode="stretch"
      source={questionImage1 as number}
      style={styles.ChallengeCard}>
      <View style={styles.groupName}>
        <GradientText
          size={TextSize.LEVEL_2}
          weight={'600'}
          text={'Self - Reflection'}
        />
      </View>
      <AppText
        size={TextSize.SIZE_24}
        align={'center'}
        lineHeight={30}
        weight={'700'}
        text={
          'Designate a weekend to disconnect from the world and enjoy your home as if it were a luxury hotel.'
        }
      />

      <View style={styles.appNameWrapper}>
        <GradientText
          size={TextSize.LEVEL_2}
          weight={'700'}
          text={`...${APPLICATION_NAME}`}
        />
      </View>

      {!showButton && (
        <View style={styles.btnWrapper}>
          <Button
            disabled={isSelectingSpecialChallenge}
            onPress={onPressHandler}
            theme={ButtonTheme.GRADIENT}
            style={styles.btn}>
            <AppText
              style={{color: colors.white}}
              size={TextSize.LEVEL_4}
              weight={'600'}
              text={'Lock the challenge in'}
            />
          </Button>
        </View>
      )}
    </FastImage>
  );
};

export default memo(CoreChallengeCard);

const padding = horizontalScale(20);

const styles = StyleSheet.create({
  ChallengeCard: {
    height: verticalScale(CARD_HEIGHT),
    width: horizontalScale(CARD_WIDTH),
    borderRadius: moderateScale(20),
    padding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupName: {
    position: 'absolute',
    top: verticalScale(30),
    left: padding,
  },
  appNameWrapper: {
    position: 'absolute',
    width: horizontalScale(CARD_WIDTH),
    alignItems: 'center',
    bottom: verticalScale(80),
  },
  btnWrapper: {
    width: horizontalScale(CARD_WIDTH),
    position: 'absolute',
    bottom: verticalScale(20),
    alignItems: 'center',
  },
  btn: {
    width: '87%',
  },
});
