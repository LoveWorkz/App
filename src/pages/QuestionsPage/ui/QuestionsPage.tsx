import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {AdEventType} from 'react-native-google-mobile-ads';

import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Gradient, GradientSize} from '@src/shared/ui/Gradient/Gradient';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {useColors} from '@src/app/providers/colorsProvider';
import {
  getShadowOpacity,
  globalStyles,
  windowWidth,
} from '@src/app/styles/GlobalStyle';
import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import {
  QuestionCard,
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

const questionCardHeight = verticalScale(450);
const questionCardBorderRadius = moderateScale(20);

const QuestionsPage = (props: QuestionsPageProps) => {
  const {route} = props;
  const colors = useColors();
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
  const questionsPageInfo = questionStore.questionPreviewInfo;
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
        <View style={styles.categoryWrapper}>
          <Skeleton width={100} height={40} borderRadius={10} />
        </View>
        <View style={styles.rubricAndQuestionsCountBlock}>
          <Skeleton width={60} height={18} />
          <Skeleton width={60} height={18} />
        </View>
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
      <View style={styles.categoryWrapper}>
        {questionsPageInfo.categoryName ? (
          <Gradient size={GradientSize.SMALL}>
            <AppText
              style={{color: colors.white}}
              weight={'700'}
              size={TextSize.LEVEL_5}
              text={questionsPageInfo.categoryName}
            />
          </Gradient>
        ) : (
          <View />
        )}
      </View>
      <View style={styles.rubricAndQuestionsCountBlock}>
        <View style={styles.rubricNameWrapper}>
          {questionsPageInfo.rubricName && (
            <GradientText
              style={styles.rubricText}
              weight={'700'}
              size={TextSize.LEVEL_4}
              text={questionsPageInfo.rubricName}
            />
          )}
        </View>
        <View style={styles.categoryNameWrapper}>
          <AppText
            style={{color: colors.primaryTextColor}}
            weight={'500'}
            size={TextSize.LEVEL_5}
            text={`${questionsPageInfo.questionNumber}/${questionsStore.questionsSize}`}
          />
        </View>
      </View>
      <View style={styles.question}>
        <HorizontalSlide
          isSlideEnabled={isSliideEnabled}
          onSwipeHandler={onSwipeHandler}
          data={formattedQuestions}
          itemStyle={styles.slideItemStyle}
          Component={QuestionCard}
          defaultElement={questionsPageInfo.defaultQuestionNumber}
        />
        <View
          style={[
            styles.questionsCard,
            {
              ...styles.questionsCardBack,
              ...getShadowOpacity(theme).shadowOpacity_level_1,
            },
            {
              backgroundColor: colors.questionCardBackColor,
            },
          ]}
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
  categoryWrapper: {
    position: 'absolute',
  },
  categoryNameWrapper: {
    marginLeft: 'auto',
  },
  rubricAndQuestionsCountBlock: {
    marginTop: verticalScale(55),
    marginBottom: verticalScale(10),
  },
  rubricNameWrapper: {
    width: '80%',
    position: 'absolute',
  },
  rubricText: {
    textTransform: 'capitalize',
  },
  question: {
    width: '100%',
  },
  questionsCard: {
    height: questionCardHeight,
    width: windowWidth * 0.88,
    borderRadius: questionCardBorderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(40),
  },
  questionsCardBack: {
    position: 'absolute',
    right: 0,
    top: verticalScale(40),
  },
  slideItemStyle: {
    ...globalStyles.slideItemZindex,
  },
  questionCardSkeleton: {
    marginTop: verticalScale(30),
  },
});
