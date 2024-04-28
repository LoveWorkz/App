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
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {ChallengeIntroInfoPopup} from '../ChallengeInfoPopup/ChallengeIntroInfoPopup';
import ChallengeCategoryBlock from '../ChallengeCategoryBlock/ChallengeCategoryBlock';
import challengeStore from '../../model/store/challengeStore';

const ChallengeIntroCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const colors = useColors();
  const language = useLanguage();

  const specialChallenge = challengeStore.specialChallenge;

  const textStyle = useMemo(() => {
    return {color: colors.white};
  }, []);

  const onChallengeBackgroundPressHandler = () => {
    setIsVisible(prev => !prev);
  };

  const LetsDoItPressHandler = () => {
    setIsPopupVisible(true);
  };

  if (!specialChallenge) {
    return null;
  }

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
          text={specialChallenge.title[language]}
        />

        <ChallengeCategoryBlock text="Friendship" />
      </View>
      <FastImage
        resizeMode="stretch"
        source={challengeIntroCard as number} // image number
        style={styles.cardBg}>
        {specialChallenge.description.map((item, i) => {
          return (
            <View key={i.toString()} style={styles.descriptionItem}>
              <AppText
                style={textStyle}
                weight={'500'}
                align={'center'}
                size={TextSize.LEVEL_5}
                text={item[language]}
              />
            </View>
          );
        })}
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
        <View>
          {specialChallenge.background.map((item, i) => {
            return (
              <View key={i.toString()} style={styles.backgroundItem}>
                <AppText
                  style={textStyle}
                  weight={'500'}
                  size={TextSize.LEVEL_4}
                  text={item[language]}
                />
              </View>
            );
          })}
        </View>
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
        specialChallenge={specialChallenge}
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
  descriptionItem: {
    marginBottom: verticalScale(20),
  },
  backgroundItem: {
    marginBottom: verticalScale(15),
  },
});
