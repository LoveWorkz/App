import React, {memo, useCallback, useEffect, useMemo} from 'react';
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
import {CategoryKey} from '@src/entities/Category';
import {profileStore} from '@src/entities/Profile';
import {getCongratsModalContent} from '@src/pages/CategoriesPage';
import {CongratsModal} from '@src/widgets/CongratsModal';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {LoaderWrapper} from '@src/shared/ui/LoaderWrapper/LoaderWrapper';
import {initInterstitialAd} from '@src/app/config/admobConfig';
import {WowThatWasFast} from '@src/widgets/WowThatWasFastModal';
import {DocumentType} from '@src/shared/types/types';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import questionsStore from '../model/store/questionsStore';
import {getFormattedQuestionsWrapper} from '../model/lib/questions';

interface QuestionsPageProps {
  route?: {params: {type: DocumentType; id: string; initialQuestionId: string}};
}

const interstitial = initInterstitialAd();

const QuestionsPage = (props: QuestionsPageProps) => {
  const {route} = props;
  const colors = useColors();
  const {t, i18n} = useTranslation();
  const {theme} = useTheme();

  const key = route?.params.type;
  const id = route?.params.id;
  const initialQuestionId = route?.params.initialQuestionId;
  const isSliideEnabled = !initialQuestionId;

  const questions = questionsStore.questions;
  const questionsPageInfo = questionStore.questionPreviewInfo;
  const currentCategory = profileStore.currentCategory?.currentCategory;
  const language = i18n.language as LanguageValueType;
  const content = getCongratsModalContent(t)[currentCategory as CategoryKey];

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
      key: key,
      language,
      questionId: initialQuestionId,
    });
  }, [key, id, language, initialQuestionId]);

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

  return (
    <LoaderWrapper isLoading={questionsStore.questionsPageloading}>
      <View style={styles.QuestionsPage}>
        <Gradient style={styles.category} size={GradientSize.SMALL}>
          <AppText
            style={{color: colors.white}}
            weight={'700'}
            size={TextSize.LEVEL_5}
            text={questionsPageInfo.categoryName}
          />
        </Gradient>
        <View style={styles.rubricAndQuestionsCountBlock}>
          <View>
            <GradientText
              style={styles.rubricText}
              weight={'700'}
              size={TextSize.LEVEL_4}
              text={questionsPageInfo.rubricName}
            />
          </View>
          <View>
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
        <CongratsModal
          content={content}
          visible={questionsStore.congratsModalVisible}
          setVisible={questionsStore.setCongratsModalVisible}
        />
      </View>
    </LoaderWrapper>
  );
};

export default memo(observer(QuestionsPage));

const styles = StyleSheet.create({
  QuestionsPage: {
    flex: 1,
  },
  category: {
    marginBottom: horizontalScale(20),
  },
  rubricAndQuestionsCountBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rubricText: {
    textTransform: 'capitalize',
  },

  question: {
    width: '100%',
  },
  questionsCard: {
    height: verticalScale(450),
    width: windowWidth * 0.88,
    borderRadius: moderateScale(20),
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
});
