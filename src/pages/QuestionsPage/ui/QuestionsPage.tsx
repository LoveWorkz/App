import React, {memo, useCallback, useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Gradient, GradientSize} from '@src/shared/ui/Gradient/Gradient';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {useColors} from '@src/app/providers/colorsProvider';
import {globalStyles, windowWidth} from '@src/app/styles/GlobalStyle';
import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import {QuestionCard, QuestionType} from '@src/entities/QuestionCard';
import {CategoryName} from '@src/entities/Category';
import {profileStore} from '@src/entities/Profile';
import {getCongratsModalContent} from '@src/pages/CategoriesPage';
import {CongratsModal} from '@src/widgets/CongratsModal';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {LoaderWrapper} from '@src/shared/ui/LoaderWrapper/LoaderWrapper';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import questionsStore from '../model/store/questionsStore';
import WowThatWasFastModal from './WowThatWasFastModal/WowThatWasFastModal';
import {getFormattedQuestionsWrapper} from '../model/lib/questions';

interface QuestionsPageProps {
  route?: {params: {type: 'rubric' | 'category' | 'favorite'; id: string}};
}

const QuestionsPage = (props: QuestionsPageProps) => {
  const {route} = props;
  const colors = useColors();
  const {t, i18n} = useTranslation();
  const {theme} = useTheme();

  const key = route?.params.type;
  const id = route?.params.id;
  const questions = questionsStore.questions;
  const questionsPageInfo = questionsStore.questionsPageInfo;
  const currentCategory = profileStore.currentCategory?.currentCategory;
  const language = i18n.language as LanguageValueType;

  const getFormattedQuestions = useMemo(() => {
    return getFormattedQuestionsWrapper({
      questions,
      isDarkMode: theme === Theme.Dark,
    });
  }, [questions, theme]);

  const content = getCongratsModalContent(t)[currentCategory as CategoryName];

  const formattedQuestions = useMemo(() => {
    return getFormattedQuestions();
  }, [getFormattedQuestions]);

  useFocusEffect(
    useCallback(() => {
      questionsStore.clearQuestionsInfo();
    }, []),
  );

  useEffect(() => {
    if (!key) {
      return;
    }

    questionsStore.init({
      id,
      key: key,
      language,
    });
  }, [key, id, language]);

  const onSwipeHandler = useCallback(
    (param: QuestionType) => {
      if (!key) {
        return;
      }

      questionsStore.swipe({question: param, key, language});

      if (id) {
        questionsStore.setQuestionsSwipedInfo({
          questionId: param.id,
          id: id,
          type: key,
        });

        questionsStore.checkIfAllQuestionsSwiped({
          questionId: param.id,
          type: key,
        });
      }
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
              text={`${questionsPageInfo.swipedQuestionsCount}/${questionsPageInfo.questionsCount}`}
            />
          </View>
        </View>
        <View style={styles.question}>
          <HorizontalSlide
            onSwipeHandler={onSwipeHandler}
            data={formattedQuestions}
            itemStyle={styles.slideItemStyle}
            Component={QuestionCard}
            defaultElement={questionsPageInfo.swipedQuestionsCount}
          />
          <View
            style={[
              styles.questionsCard,
              styles.questionsCardBack,
              {backgroundColor: colors.questionCardBackColor},
            ]}
          />
        </View>
        <WowThatWasFastModal
          visible={questionsStore.thatWasFastModalVisible}
          setVisible={questionsStore.setThatWasFastModalVisible}
        />
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
    ...globalStyles.shadowOpacity,
  },

  questionsCardBack: {
    position: 'absolute',
    right: 0,
    top: verticalScale(40),
    ...globalStyles.simpleShadowOpacity,
  },
  slideItemStyle: {
    zIndex: 1,
  },
});
