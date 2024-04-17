import React, {memo, useCallback, useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {AdEventType} from 'react-native-google-mobile-ads';

import {moderateScale, verticalScale} from '@src/shared/lib/Metrics';
import {globalStyles} from '@src/app/styles/GlobalStyle';
import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import {
  QuestionCard,
  questionCardHeight,
  questionCardWidth,
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
import questionsStore from '../model/store/questionsStore';
import {getFormattedQuestionsWrapper} from '../model/lib/questions';
import QuestionPageCongratsModal from './QuestionPageCongratsModal/QuestionPageCongratsModal';

interface QuestionsPageProps {
  route?: {
    params: {
      type: DocumentType;
      id: string;
      initialQuestionId: string;
      sessionId: string;
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

  const key = route?.params.type;
  const id = route?.params.id;
  const sharedQuestionId = route?.params.initialQuestionId;
  const isSliideEnabled = !sharedQuestionId;

  const questions = questionsStore.questions;
  const defaultQuestionNumber = questionStore.defaultQuestionNumber;
  const language = i18n.language as LanguageValueType;
  const isLoading = questionsStore.questionsPageloading;
  const sharedSessionId = route?.params.sessionId;
  const sessionId = sharedSessionId || sessionStore.session?.id;

  useFocusEffect(
    useCallback(() => {
      questionsStore.clearQuestionsInfo();
      return () => setIsGradient(false);
    }, []),
  );

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
      },
    );

    return unsubscribe;
  }, [key]);

  useEffect(() => {
    if (!key) {
      return;
    }

    questionsStore.init({
      id,
      key,
      language,
      sharedQuestionId,
      sessionId,
      setIsGradient,
    });
  }, [key, id, language, sharedQuestionId, sessionId]);

  const getFormattedQuestions = useMemo(() => {
    return getFormattedQuestionsWrapper({
      questions,
      isDarkMode: theme === Theme.Dark,
    });
  }, [questions, theme]);

  const formattedQuestions = useMemo(() => {
    return getFormattedQuestions();
  }, [getFormattedQuestions]);

  const onSwipeHandler = useCallback(
    (param: QuestionType, questionNumber: number) => {
      if (!key) {
        return;
      }

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
    [key, id, language],
  );

  if (isLoading) {
    return (
      <View style={styles.QuestionsPage}>
        <View style={styles.questionCardSkeleton}>
          <Skeleton
            height={questionCardHeight}
            borderRadius={questionCardBorderRadius}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.QuestionsPage}>
      <View style={styles.question}>
        <HorizontalSlide
          isGradient={isGradient}
          isSlideEnabled={isSliideEnabled}
          onSwipeHandler={onSwipeHandler}
          data={formattedQuestions}
          itemStyle={styles.slideItemStyle}
          Component={QuestionCard}
          defaultElement={defaultQuestionNumber}
          itemWidth={questionCardWidth}
        />
      </View>
      <WowThatWasFast />
      <QuestionPageCongratsModal />
    </View>
  );
};

export default memo(observer(QuestionsPage));

const styles = StyleSheet.create({
  QuestionsPage: {
    flex: 1,
  },
  question: {
    width: '100%',
  },
  slideItemStyle: {
    ...globalStyles.slideItemZindex,
  },
  questionCardSkeleton: {
    marginTop: verticalScale(30),
  },
});
