import React, {memo, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {SvgXml} from 'react-native-svg';
import FastImage from 'react-native-fast-image';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {challengeIntroCard} from '@src/shared/assets/images';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {getArrowDownIcon} from '@src/shared/assets/icons/ArrowDown';
import {ArrowUpIcon} from '@src/shared/assets/icons/ArrowUp';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {ChallengeIntroInfoPopup} from '../ChallengeInfoPopup/ChallengeIntroInfoPopup';
import {challengeInfoPopupList} from '../../model/lib/challenge';
import ChallengeCategoryBlock from '../ChallengeCategoryBlock/ChallengeCategoryBlock';

const ChallengeIntroCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const colors = useColors();

  const textStyle = useMemo(() => {
    return {color: colors.white};
  }, []);

  const onChallengeBackgroundPressHandler = () => {
    setIsVisible(prev => !prev);
  };

  const LetsDoItPressHandler = () => {
    setIsPopupVisible(true);
  };

  return (
    <View style={styles.ChallengeIntroCard}>
      <View style={styles.topPart}>
        <AppText
          style={[styles.text, textStyle]}
          size={TextSize.LEVEL_4}
          text={"Your today's challenge"}
        />
        <AppText
          style={[styles.text, textStyle]}
          weight={'600'}
          size={TextSize.LEVEL_6}
          text={'The Walk of Gratitude '}
        />

        <ChallengeCategoryBlock text="Friendship" />
      </View>
      <FastImage
        resizeMode="stretch"
        source={challengeIntroCard as number} // image number
        style={styles.cardBg}>
        <AppText
          style={textStyle}
          weight={'500'}
          align={'center'}
          size={TextSize.LEVEL_5}
          text={
            'From the list provided, select five appreciations you would like to express toward your partner in your own words. Add an example of when your partner demonstrated each action or displayed the positive qualities you are appreciating.'
          }
        />
      </FastImage>

      <Button
        style={[
          styles.challengeBackgroundWrapper,
          {marginBottom: verticalScale(isVisible ? 20 : 0)},
        ]}
        onPress={onChallengeBackgroundPressHandler}>
        <AppText
          size={TextSize.LEVEL_4}
          weight={'600'}
          style={[textStyle, styles.challengeBackgroundText]}
          text={true ? 'Challenge background' : 'Collapse'}
        />
        {isVisible ? (
          <SvgXml xml={ArrowUpIcon} style={styles.icon} fill={colors.white} />
        ) : (
          <SvgXml
            xml={getArrowDownIcon()}
            style={styles.icon}
            stroke={colors.white}
          />
        )}
      </Button>
      {isVisible && (
        <AppText
          style={textStyle}
          weight={'500'}
          size={TextSize.LEVEL_4}
          text={
            'Conversations between partners can veer off into negative territory occasionally, often without warning. This risks a downward spiral of negative comments followed by negative responses which generate further negative comments. This dynamic rarely addresses the core issue and leaves both parties feeling hurt and helpless.'
          }
        />
      )}

      <Button
        onPress={LetsDoItPressHandler}
        theme={ButtonTheme.NORMAL}
        style={[styles.btn, {backgroundColor: colors.white}]}>
        <GradientText
          size={TextSize.LEVEL_4}
          weight={'600'}
          text={'We’re ready. Let’s do it!'}
        />
      </Button>

      <ChallengeIntroInfoPopup
        text={challengeInfoPopupList}
        visible={isPopupVisible}
        setVisible={setIsPopupVisible}
      />
    </View>
  );
};

export default memo(observer(ChallengeIntroCard));

const width = '90%';

const styles = StyleSheet.create({
  ChallengeIntroCard: {
    flex: 1,
    alignItems: 'center',
  },
  topPart: {
    marginBottom: verticalScale(20),
    alignItems: 'center',
  },
  text: {
    marginBottom: verticalScale(20),
  },
  cardBg: {
    height: verticalScale(450),
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(30),
  },
  challengeBackgroundWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  icon: {
    width: horizontalScale(14),
    height: horizontalScale(14),
    marginLeft: horizontalScale(10),
  },
  btn: {
    marginTop: verticalScale(25),
    width: width,
  },
  challengeBackgroundText: {
    textDecorationLine: 'underline',
  },
});
