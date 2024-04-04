import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
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
import {PresSessionModal, sessionStore} from '@src/entities/Session';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
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
      showPreSessionPopup: boolean;
    };
  };
}

const interstitial = initInterstitialAd();

const questionCardBorderRadius = moderateScale(20);

const QuestionsPage = (props: QuestionsPageProps) => {
  const {route} = props;
  const {i18n} = useTranslation();
  const {theme} = useTheme();

  const showPreSessionPopup = route?.params.showPreSessionPopup;

  const [isPreSessionPopupVisible, setIsPreSessionPopupVisible] = useState(
    !!showPreSessionPopup,
  );

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
    });
  }, [key, id, language, sharedQuestionId, sessionId]);

  const onPreSessionConfirmHandler = useCallback(() => {
    setIsPreSessionPopupVisible(false);
  }, []);

  const onPreSessionCancelHandler = useCallback(() => {
    navigation.navigate(TabRoutesNames.HOME);
    setIsPreSessionPopupVisible(false);
  }, []);

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
      {!!showPreSessionPopup && (
        <PresSessionModal
          onConfirm={onPreSessionConfirmHandler}
          onCancel={onPreSessionCancelHandler}
          visible={isPreSessionPopupVisible}
          setVisible={setIsPreSessionPopupVisible}
        />
      )}
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
