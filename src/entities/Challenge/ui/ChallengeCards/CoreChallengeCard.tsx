import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {observer} from 'mobx-react-lite';
import {SvgXml} from 'react-native-svg';

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
import {DisplayText} from '@src/shared/types/types';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {
  OutlineLockGradientIcon,
  OutlineLockIcon,
} from '@src/shared/assets/icons/Lock';
import challengeStore from '../../model/store/challengeStore';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@src/app/providers/themeProvider';

interface ChallengeCardProps {
  description: DisplayText;
  groupName: string;
  groupId: string;
  id: string;
  isSessionFlow: boolean;
  isChallengeCompleted?: boolean;
}

const CoreChallengeCard = (props: ChallengeCardProps) => {
  const {
    description,
    groupName,
    id,
    groupId,
    isSessionFlow,
    isChallengeCompleted,
  } = props;
  const colors = useColors();
  const language = useLanguage();
  const {t} = useTranslation();
  const {isDark} = useTheme();

  const challengelockedHandler = () => {
    if (isChallengeCompleted) {
      return;
    }

    challengeStore.removeLockedChallengeId({groupId});
  };

  const lockTheChallengeInHandler = () => {
    challengeStore.setLockedChallengeIds({id, groupId});
  };

  return (
    <>
      <FastImage
        resizeMode="stretch"
        source={questionImage1 as number}
        style={[
          styles.ChallengeCard,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            position: 'absolute',
            top: 0,
            zIndex: 1,
            opacity: isDark ? 0.3 : 1,
          },
        ]}
      />
      <View
        style={[
          styles.ChallengeCard,
          {
            backgroundColor: isDark ? colors.darkCard : colors.white,
          },
        ]}>
        <View style={styles.groupName}>
          <GradientText
            size={TextSize.LEVEL_2}
            weight={'600'}
            text={groupName}
          />
        </View>
        <AppText
          size={TextSize.SIZE_24}
          align={'center'}
          lineHeight={30}
          weight={'700'}
          text={description[language]}
        />

        <View style={styles.appNameWrapper}>
          <GradientText
            size={TextSize.LEVEL_2}
            weight={'700'}
            text={`...${APPLICATION_NAME}`}
          />
        </View>
      </View>
      {isSessionFlow && (
        <View style={styles.btnWrapper}>
          {challengeStore.isChallengeLockedIn(id) || !!isChallengeCompleted ? (
            <Button
              onPress={challengelockedHandler}
              theme={ButtonTheme.OUTLINED}
              style={[
                styles.challengeLockedBtn,
                {backgroundColor: colors.buttonLocked},
              ]}>
              <View style={styles.lockIcon}>
                <SvgXml
                  fill={isDark ? colors.lavenderBlue2 : colors.primaryTextColor}
                  xml={OutlineLockIcon}
                  width={horizontalScale(21)}
                  height={horizontalScale(21)}
                />
              </View>
              <AppText
                style={{
                  color: isDark
                    ? colors.lavenderBlue2
                    : colors.primaryTextColor,
                }}
                size={TextSize.LEVEL_4}
                weight={'600'}
                text={t('common.challenge_locked')}
              />
            </Button>
          ) : (
            <Button
              onPress={lockTheChallengeInHandler}
              theme={ButtonTheme.OUTLINED_GRADIENT}
              style={styles.lockChallengeBtn}>
              <View style={styles.lockChallengeContent}>
                <View style={styles.lockIcon}>
                  <SvgXml
                    xml={OutlineLockGradientIcon}
                    width={horizontalScale(21)}
                    height={horizontalScale(21)}
                  />
                </View>
                <GradientText
                  size={TextSize.LEVEL_4}
                  weight={'600'}
                  text={t('common.lock_the_challenge_in')}
                />
              </View>
            </Button>
          )}
        </View>
      )}
    </>
  );
};

export default memo(observer(CoreChallengeCard));

const padding = horizontalScale(10);
const btnWidth = '87%';

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
    bottom: verticalScale(20),
    right: padding,
  },
  btnWrapper: {
    width: horizontalScale(CARD_WIDTH),
    position: 'absolute',
    bottom: verticalScale(45),
    alignItems: 'center',
    zIndex: 2,
  },
  lockChallengeBtn: {
    width: btnWidth,
  },
  lockChallengeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeLockedBtn: {
    width: btnWidth,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
  },
  lockIcon: {
    marginRight: horizontalScale(10),
  },
});
