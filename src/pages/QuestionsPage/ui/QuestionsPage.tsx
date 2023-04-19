import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

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
import {Loader, LoaderSize} from '@src/shared/ui/Loader/Loader';
import {QuestionCard, QuestionType} from '@src/entities/QuestionCard';
import questionsStore from '../model/store/questionsStore';
import WowThatWasFastModal from './WowThatWasFastModal/WowThatWasFastModal';
import {getFormattedQuestionsWrapper} from '../model/lib/questions';
import {CongratsModal} from './CongratsModal/CongratsModal';

interface QuestionsPageProps {
  route?: {params: {type: 'rubric' | 'category' | 'favorite'; id: string}};
}

const QuestionsPage = (props: QuestionsPageProps) => {
  const {route} = props;
  const key = route?.params.type;
  const id = route?.params.id;
  const colors = useColors();
  const questions = questionsStore.questions;
  const questionsPageInfo = questionsStore.questionsPageInfo;

  const getFormattedQuestions = getFormattedQuestionsWrapper(questions);

  useFocusEffect(
    useCallback(() => {
      questionsStore.clearQuestionsInfo();
    }, []),
  );

  useEffect(() => {
    if (!key) {
      return;
    }

    questionsStore.getQuestionsPageInfo({
      id,
      key: key,
    });
  }, [key, id]);

  const onSwipeHandler = useCallback(
    (param: QuestionType) => {
      if (!key) {
        return;
      }

      questionsStore.swipe({question: param, key});

      if (id) {
        questionsStore.setQuestionsSwipedInfo({
          questionId: param.id,
          id: id,
          type: key,
        });

        questionsStore.checkIfAllQuestionsSwiped({
          questionId: param.id,
          categoryId: id,
          type: key,
        });
      }
    },
    [key, id],
  );

  if (!questions.length) {
    return (
      <View style={styles.QuestionsPage}>
        <View style={styles.loader}>
          <Loader size={LoaderSize.LARGE} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.QuestionsPage}>
      <Gradient style={styles.category} size={GradientSize.SMALL}>
        <AppText
          style={styles.categoryText}
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
          data={getFormattedQuestions()}
          itemStyle={styles.slideItemStyle}
          Component={QuestionCard}
          defaultElement={questionsPageInfo.swipedQuestionsCount}
        />
        <View style={[styles.questionsCard, styles.questionsCardBack]} />
      </View>
      <WowThatWasFastModal
        visible={questionsStore.thatWasFastModalVisible}
        setVisible={questionsStore.setThatWasFastModalVisible}
      />
      <CongratsModal
        visible={questionsStore.congratsModalVisible}
        setVisible={questionsStore.setCongratsModalVisible}
      />
    </View>
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
  categoryText: {
    color: 'white',
  },
  rubricAndQuestionsCountBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
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
    backgroundColor: 'white',
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(40),
    ...globalStyles.shadowOpacity,
  },

  questionsCardBack: {
    backgroundColor: '#F8F5FF',
    position: 'absolute',
    right: 0,
    top: 8,
    ...globalStyles.simpleShadowOpacity,
  },
  slideItemStyle: {
    zIndex: 1,
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
