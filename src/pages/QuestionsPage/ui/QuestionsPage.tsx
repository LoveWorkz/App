import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
// import {AdEventType} from 'react-native-google-mobile-ads';

import {moderateScale, verticalScale} from '@src/shared/lib/Metrics';
import {globalStyles, windowWidth} from '@src/app/styles/GlobalStyle';
import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import {
  emptyCard,
  QuestionCard,
  QuestionCardsFooter,
  questionStore,
  QuestionType,
} from '@src/entities/QuestionCard';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {initInterstitialAd} from '@src/app/config/admobConfig';
import {WowThatWasFast} from '@src/widgets/WowThatWasFastModal';
import {DocumentType} from '@src/shared/types/types';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {sessionStore} from '@src/entities/Session';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {useGradient} from '@src/app/providers/GradientProvider';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  HEADER_HEIGHT_ADNDROID,
  HEADER_HEIGHT_IOS,
  isPlatformIos,
} from '@src/shared/consts/common';
import {CustomHeader} from '@src/widgets/headers/CustomHeader';
import {QuestionsHeaderRight} from '@src/widgets/headers/QuestionsHeaderRight';
import questionsStore from '../model/store/questionsStore';
import {
  getDefaultIndex,
  getFormattedQuestionsWrapper,
} from '../model/lib/questions';
import {rubricStore} from '@src/entities/Rubric';
import {userStore} from '@src/entities/User';
// import {navigation} from '@src/shared/lib/navigation/navigation';
import challengeGroupStore from '@src/entities/ChallengeGroup/model/store/challengeGroupStore';
import challengeStore from '@src/entities/Challenge/model/store/challengeStore';
// import breakPageStore from '@src/pages/BreakPage/model/store/breakPageStore';

interface QuestionsPageProps {
  route?: {
    params: {
      type: DocumentType;
      id: string;
      initialQuestionId: string;
      sessionId: string;
      prevRouteName: AppRouteNames | TabRoutesNames;
    };
  };
}

const interstitial = initInterstitialAd();

const questionCardBorderRadius = moderateScale(20);

const QuestionsPage = (props: QuestionsPageProps) => {
  const {route} = props;
  const {i18n} = useTranslation();
  const {theme} = useTheme();
  const {setIsGradient, isGradient} = useGradient();
  const [timer, setTimer] = useState<null | NodeJS.Timeout>(null);

  const userRubricsSeen = userStore.user?.rubrics_seen;
  const rubricId = props.route?.params.id;

  useEffect(() => {
    if (rubricId && userRubricsSeen && !userRubricsSeen?.includes(rubricId)) {
      userStore.updateUser({
        data: [...userRubricsSeen, rubricId],
        field: 'rubrics_seen',
      });
      userStore.fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const key = route?.params.type;
  const id = route?.params.id;
  const sharedQuestionId = route?.params.initialQuestionId;
  const isSliideEnabled = !sharedQuestionId;

  const questions = questionsStore.questions;
  const rubrics = rubricStore.rubrics;
  const defaultQuestionNumber = questionStore.defaultQuestionNumber;
  const language = i18n.language as LanguageValueType;
  const isLoading = questionsStore.questionsPageloading;
  const sharedSessionId = route?.params.sessionId;
  const sessionId = sharedSessionId || sessionStore.session?.id;
  const shouldDisplayFastModal = key === DocumentType.RUBRIC;

  const currentCoreChallengeGroup =
    challengeGroupStore.currentCoreChallengeGroup;
  const groupName = currentCoreChallengeGroup?.displayName[language];

  const isPreviousScreenBreak =
    route?.params?.prevRouteName === AppRouteNames.BREAK;

  const defaultElementIndex = useMemo(() => {
    return getDefaultIndex({
      isPreviousScreenBreak,
      defaultQuestionNumber,
      questions,
    });
  }, [isPreviousScreenBreak, defaultQuestionNumber, questions]);

  useFocusEffect(
    useCallback(() => {
      questionsStore.clearQuestionsInfo();

      // const adListener = interstitial.addAdEventListener(
      //   AdEventType.LOADED,
      //   () => interstitial.show(),
      // );

      if (key) {
        questionsStore.init({
          id,
          key,
          language,
          sharedQuestionId,
          sessionId,
          setIsGradient,
        });
      }

      return () => {
        setIsGradient(false);
        // adListener();
      };
    }, [
      key,
      id,
      language,
      sharedQuestionId,
      sessionId,
      setIsGradient,
      isPreviousScreenBreak,
    ]),
  );
  const getFormattedQuestions = useMemo(() => {
    return getFormattedQuestionsWrapper({
      questions,
      rubrics,
      isDarkMode: theme === Theme.Dark,
    });
  }, [questions, theme]);

  const formattedQuestions = useMemo(() => {
    return getFormattedQuestions();
  }, [getFormattedQuestions]);

  const incrementViewCountHandler = useCallback(
    (param: QuestionType) => {
      // Clear any existing timer
      if (timer) {
        clearTimeout(timer);
      }

      // Set a new timer that increments the view count after 5 seconds
      const newTimer = setTimeout(() => {
        questionStore.incrementQuestionViewCount(param.id);
      }, 5000);

      setTimer(newTimer);
    },
    [timer],
  );

  const lockedChallengeId = challengeStore.lockedChallengeId;
  const isChallengeLocked =
    challengeStore.isChallengeLockedIn(lockedChallengeId);

  useEffect(() => {
    if (isChallengeLocked) {
      // breakPageStore.letsDoThisPressHandler(language);
      // navigation.navigate(AppRouteNames.CORE_CHALLENGE_CARDS, {
      //   title: groupName,
      // });
    }
  }, [groupName, isChallengeLocked, language]);

  const onSwipeHandler = useCallback(
    (param: QuestionType, questionNumber: number) => {
      if (!key) {
        return;
      }

      incrementViewCountHandler(param);

      questionsStore.swipe({
        question: param,
        key,
        language,
        documentId: id,
        interstitial,
        questionNumber,
        setIsGradient,
      });
    },
    [key, id, language, timer, incrementViewCountHandler],
  );

  const questionsWithEmptyCard = useMemo(() => {
    if (key === DocumentType.CATEGORY) {
      return [...formattedQuestions, emptyCard];
    }

    return formattedQuestions;
  }, [formattedQuestions, key]);

  const Footer = useCallback(
    ({count, currentIndex}: {count: number; currentIndex: number}) => {
      return (
        <QuestionCardsFooter
          count={count}
          currentIndex={currentIndex}
          isWhite={isGradient}
        />
      );
    },
    [isGradient],
  );

  if (isLoading) {
    return (
      <View style={styles.QuestionsPage}>
        <View style={styles.skeletonHeader} />
        <View style={styles.questionCardSkeleton}>
          <Skeleton
            height={CARD_HEIGHT}
            borderRadius={questionCardBorderRadius}
          />
        </View>
      </View>
    );
  }

  // console.log('QUESTIONS', questions);

  // console.log('questionsWithEmptyCard', questionsWithEmptyCard[0]);

  return (
    <View style={styles.QuestionsPage}>
      <StatusBar barStyle={isGradient ? 'light-content' : 'dark-content'} />
      <View style={styles.headerWrapper}>
        <CustomHeader
          isSecondaryBackground={isGradient}
          HeaderRight={QuestionsHeaderRight}
        />
      </View>
      <HorizontalSlide
        isSlideEnabled={isSliideEnabled}
        onSwipeHandler={onSwipeHandler}
        data={questionsWithEmptyCard}
        itemStyle={styles.slideItemStyle}
        Component={QuestionCard}
        defaultElement={defaultElementIndex}
        itemWidth={CARD_WIDTH}
        Footer={Footer}
        showLength={isGradient ? 4 : 5}
        opacityInterval={isGradient ? 0.3 : 0}
      />
      {!shouldDisplayFastModal && <WowThatWasFast />}
    </View>
  );
};

export default memo(observer(QuestionsPage));

const styles = StyleSheet.create({
  QuestionsPage: {
    flex: 1,
    alignItems: 'center',
  },
  question: {
    width: '100%',
    height: '100%',
  },
  slideItemStyle: {
    ...globalStyles.slideItemZindex,
  },
  headerWrapper: {
    width: windowWidth,
  },

  questionCardSkeleton: {
    marginTop: verticalScale(30),
    width: '90%',
  },
  skeletonHeader: {
    height: isPlatformIos ? HEADER_HEIGHT_IOS : HEADER_HEIGHT_ADNDROID,
  },
});
