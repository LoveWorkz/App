import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {useTheme} from '@src/app/providers/themeProvider';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {RubricType} from '../model/types/rubricTypes';
import rubricStore from '../model/store/rubricStore';

interface RubricProps {
  rubric: RubricType;
  isLoading: boolean;
}

const height = 80;
const borderRadius = moderateScale(20);

export const Rubric = (props: RubricProps) => {
  const {rubric, isLoading} = props;
  const {displayName, questions, description, currentQuestion} = rubric;
  const colors = useColors();
  const {i18n} = useTranslation();
  const {theme} = useTheme();

  const language = i18n.language as LanguageValueType;

  if (isLoading) {
    return (
      <View>
        <Skeleton height={height} borderRadius={borderRadius} />
      </View>
    );
  }

  const swipedQuestionCount = rubricStore.getQuestionNumberForRubric({
    questionIds: questions,
    currenctQuestionId: currentQuestion,
  });

  return (
    <View
      style={[
        styles.Rubric,
        {
          ...getShadowOpacity(theme).shadowOpacity_level_1,
          backgroundColor: colors.bgSecondaryColor,
        },
      ]}>
      <View>
        <AppText
          style={[styles.name, {color: colors.primaryTextColor}]}
          weight={'600'}
          size={TextSize.LEVEL_4}
          text={displayName[language]}
        />
        <AppText
          style={[styles.text]}
          size={TextSize.LEVEL_2}
          text={description[language]}
        />
      </View>
      <View>
        <GradientText
          style={{color: colors.primaryTextColor}}
          weight={'700'}
          size={TextSize.LEVEL_3}
          text={`${swipedQuestionCount}/${questions.length}`}
        />
      </View>
    </View>
  );
};

export default memo(Rubric);

const styles = StyleSheet.create({
  Rubric: {
    height: height,
    borderRadius: borderRadius,
    backgroundColor: '#F1F3FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
  },
  name: {
    textTransform: 'uppercase',
  },
  text: {
    color: '#B6B6BD',
    marginTop: verticalScale(5),
  },
});
