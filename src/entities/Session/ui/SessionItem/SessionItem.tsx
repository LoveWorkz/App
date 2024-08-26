import React, {memo, useCallback, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SvgXml} from 'react-native-svg';
import {observer} from 'mobx-react-lite';

import {useColors} from '@src/app/providers/colorsProvider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {getShadowOpacity, globalPadding} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {EllipseIcon} from '@src/shared/assets/icons/Ellipse';
import {PlayIcon} from '@src/shared/assets/icons/Play';
import {LockIcon} from '@src/shared/assets/icons/Lock';
import {HeartIcon, HeartIconWithoutColor} from '@src/shared/assets/icons/Heart';
import {Button} from '@src/shared/ui/Button/Button';
import {ColorType} from '@src/app/styles/themeStyle';
import {SelectedEllipseIcon} from '@src/shared/assets/icons/SelectedEllipse';
import {favoriteStore} from '@src/entities/Favorite';
import PremiumBlock from '@src/shared/ui/PremiumBlock/PremiumBlock';
import {SessionState, SessionType} from '../../model/types/sessionType';
import sessionStore from '../../model/store/sessionStore';
import PresSessionModal from '../PreSessionModal/PreSessionModal';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {questionsStore} from '@src/pages/QuestionsPage';
import {QuestionType} from '@src/entities/QuestionCard';
import {rubricStore} from '@src/entities/Rubric';
import {mostOccurringString} from '@src/shared/utils/mostOccuringString';
import {challengesStore} from '@src/pages/ChallengesPage';
import {challengeGroupStore} from '@src/entities/ChallengeGroup';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';

interface SessionItemProps {
  session: SessionType;
  state: SessionState;
  isPremium: boolean;
}

const SessionItem = (props: SessionItemProps) => {
  const {session, state = 'completed', isPremium} = props;
  const questions = questionsStore.allQuestions;
  const rubrics = rubricStore.rubrics;
  const coreChallenges = challengesStore.challenges;
  const specialChallenges = challengesStore.specialChallenges;
  const specialChallengesGroups = challengeGroupStore.specialChallengeGroups;
  const challengeGroups = challengeGroupStore.coreChallengeGroups;
  const lang = useLanguage();

  useEffect(() => {
    challengesStore.init();
  }, []);

  const sessionQuestions = session.questions;

  const rubricsInSession = sessionQuestions.map(
    question => questions.find(q => q.id === question)?.rubricId,
  );
  const mostOccurredRubric = mostOccurringString(rubricsInSession);
  const cardFocus = rubrics.find(rubric => rubric.id === mostOccurredRubric)
    ?.displayName[lang];

  const linkedChallengeGroupId = coreChallenges.find(
    el => el.id === session.linkedCoreChallenge,
  )?.groupId;
  // const pickedCategoryGroup = challengeGroups.find(
  //   group => group.id === challengeGroup?.groupId,
  // );

  // console.log('GROUPS', challengeGroups);

  const coreChallengeGroup = challengeGroups.find(group => {
    // if (session.challenge.includes('special')) {
    //   console.log('TRUE XXX');
    //   const specialChallengesGroupId = specialChallenges.find()
    //   return (
    //     group.id ===
    //     specialChallenges.find(challenge => challenge.id === session.challenge)
    //       ?.groupId
    //   );
    // }
    if (linkedChallengeGroupId) {
      return group.id === linkedChallengeGroupId;
    } else {
      return group.id === session?.challenge;
    }
  });

  const currentSpecialChallenge = specialChallenges.find(
    challenge => challenge.id === session.challenge,
  );

  // console.log('CURRENT SPECIAL CHALLENGE', currentSpecialChallenge);
  //
  // console.log('SPECIALL CHALLENGE GROUPS', specialChallengesGroups);

  const specialChallengeGroup = specialChallengesGroups.find(group => {
    // if (session.challenge.includes('special')) {
    //   console.log('TRUE XXX');
    //   const specialChallengesGroupId = specialChallenges.find()
    //   return (
    //     group.id ===
    //     specialChallenges.find(challenge => challenge.id === session.challenge)
    //       ?.groupId
    //   );
    // }
    // if (linkedChallengeGroupId) {
    // return group.id === linkedChallengeGroupId;
    // } else {
    return group.id === currentSpecialChallenge?.groupId;
    // }
  });

  // console.log('SPECIALL CHALLENGE GROUP XXXX', specialChallengeGroup);

  const challengeGroup = session.challenge.includes('special')
    ? specialChallengeGroup
    : coreChallengeGroup;

  const roundingCategory = challengeGroup?.displayName[lang];

  // console.log('SESSION: ', session);
  console.log('XXX DISPLAY cardFocus', cardFocus);
  console.log('Rounding Category', roundingCategory);
  // console.log('most occured', mostOccurredRubric);
  // console.log('session.challenge', session.challenge);
  // console.log('Challenge group', challengeGroup?.displayName[lang]);
  // console.log('linked challnge group ID', linkedChallengeGroupId);
  // console.log('session.linkedCoreChallenge', session.linkedCoreChallenge);
  // console.log('Challenge group', challengeGroup);
  // console.log('CHALLENGES', coreChallenges);
  // console.log('QUESTIONS ALL: ', questions);
  // console.log('PICKED GROUP', pickedCategoryGroup);

  const colors = useColors();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const language = useLanguage();
  const {isDark} = useTheme();

  const [visible, setVisible] = useState(false);

  const isFavorite = favoriteStore.checkIsFavorite({
    id: session.id,
    favoriteKey: 'session',
  });

  let isBlocked = false;

  const toggleFavoriteHandler = async () => {
    sessionStore.toggleSessionFavorite({sessionid: session.id, isFavorite});
  };

  let leftIcon = EllipseIcon;
  let rightIcon = <></>;
  let bgColor = isDark ? colors.bgTertiaryColor : colors.softPeriwinkle;

  switch (state) {
    case 'completed':
      leftIcon = SelectedEllipseIcon;
      rightIcon = renderRightIcon({
        state: 'completed',
        onIconPressHandler: toggleFavoriteHandler,
        colors,
        isFavorite,
      });

      break;
    case 'current':
      leftIcon = EllipseIcon;
      rightIcon = renderRightIcon({
        state: 'current',
        colors,
      });

      bgColor = isDark ? colors.bgTertiaryColor : colors.bgSecondaryColor;

      break;
    default:
      leftIcon = LockIcon;
      rightIcon = <></>;
      isBlocked = true;
  }

  // premium logic
  if (isPremium) {
    bgColor = isDark ? colors.bgTertiaryColor : colors.disabledSessionColor;
    leftIcon = LockIcon;
  }
  const disabled = isBlocked || isPremium;

  const onSessionPressHandler = () => {
    setVisible(true);
  };

  const goToQuestions = useCallback(() => {
    setVisible(false);
    sessionStore.selectSessionAndNavigate({session});
  }, [session]);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        disabled={disabled}
        onPress={onSessionPressHandler}
        style={[
          styles.SessionItem,
          {
            ...getShadowOpacity(theme, bgColor).shadowOpacity_level_2,
            backgroundColor: bgColor,
          },
        ]}>
        {isPremium && (
          <View style={styles.premiumBlock}>
            <PremiumBlock isGradient />
          </View>
        )}
        <>
          <View style={styles.sessionNumberWrapper}>
            <SvgXml xml={leftIcon} style={styles.leftIcon} />
            <AppText
              weight={'600'}
              size={TextSize.LEVEL_2}
              text={`${t('sessions.session')} ${session.sessionNumber}`}
            />
          </View>
          <View style={styles.titleWrapper}>
            <AppText
              weight={'900'}
              size={TextSize.LEVEL_5}
              text={`${session.displayName[language]}`}
            />
          </View>
          <Text style={styles.textContainer}>
            <AppText
              weight={'400'}
              size={TextSize.LEVEL_4}
              text={t('sessions.questions_in_sessions_are_on')}
            />
            <AppText
              weight={'400'}
              style={{
                color: isDark
                  ? colors.lavenderBlue2
                  : colors.homePageCategoryTextColor,
              }}
              size={TextSize.LEVEL_4}
              text={` ${cardFocus}. `}
            />
            <AppText
              weight={'400'}
              size={TextSize.LEVEL_4}
              text={t('sessions.a_handpicked_challenge_is_part_1')}
            />
            <AppText
              weight={'400'}
              size={TextSize.LEVEL_4}
              style={{
                color: isDark
                  ? colors.lavenderBlue2
                  : colors.homePageCategoryTextColor,
              }}
              text={` ${roundingCategory} `}
            />
            <AppText
              weight={'400'}
              size={TextSize.LEVEL_4}
              text={t('sessions.a_handpicked_challenge_is_part_2')}
            />
          </Text>
        </>
        {disabled ? <></> : <>{rightIcon}</>}
      </TouchableOpacity>
      <PresSessionModal
        onConfirm={goToQuestions}
        visible={visible}
        setVisible={setVisible}
      />
    </View>
  );
};

const renderRightIcon = ({
  state,
  onIconPressHandler,
  isFavorite,
  colors,
}: {
  state: SessionState;
  onIconPressHandler?: () => void;
  isFavorite?: boolean;
  colors: ColorType;
}) => {
  switch (state) {
    case 'completed':
      return (
        <Button onPress={onIconPressHandler} style={styles.rightIconWrapper}>
          <SvgXml
            xml={isFavorite ? HeartIconWithoutColor : HeartIcon}
            style={styles.rightIcon}
            fill={isFavorite ? colors.red : 'none'}
            stroke={!isFavorite ? colors.primaryTextColor : 'none'}
          />
        </Button>
      );
    default:
      return (
        <View style={styles.rightIconWrapper}>
          <SvgXml xml={PlayIcon} style={styles.rightIcon} />
        </View>
      );
  }
};

export default memo(observer(SessionItem));

const rightIconPadding = 10;
const rightIconPosition = globalPadding - rightIconPadding;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  SessionItem: {
    borderRadius: moderateScale(20),
    padding: horizontalScale(globalPadding),
    width: '100%',
  },
  titleWrapper: {
    marginVertical: verticalScale(10),
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionNumberWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    height: horizontalScale(18),
    width: horizontalScale(18),
    marginRight: horizontalScale(6),
  },
  rightIconWrapper: {
    position: 'absolute',
    top: horizontalScale(rightIconPosition),
    right: horizontalScale(rightIconPosition),
    paddingHorizontal: horizontalScale(rightIconPadding),
    paddingVertical: horizontalScale(rightIconPadding),
  },
  rightIcon: {
    height: horizontalScale(18),
    width: horizontalScale(18),
  },
  premiumBlock: {
    position: 'absolute',
    right: horizontalScale(globalPadding),
    top: horizontalScale(globalPadding),
  },
  textContainer: {
    flexDirection: 'row',
  },
});
