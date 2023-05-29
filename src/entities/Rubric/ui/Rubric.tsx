import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {useTheme} from '@src/app/providers/themeProvider';
import {getNumberFromPercentage} from '@src/shared/lib/common';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {RubricType} from '../model/types/rubricTypes';

interface RubricProps {
  rubric: RubricType;
}

export const Rubric = (props: RubricProps) => {
  const {rubric} = props;
  const {displayName, questions, swipedQuestionsPercentage, description} =
    rubric;
  const colors = useColors();
  const {i18n} = useTranslation();
  const {theme} = useTheme();

  const language = i18n.language as LanguageValueType;

  const numberFromPercentage = Math.ceil(
    getNumberFromPercentage(swipedQuestionsPercentage, questions.length),
  );

  //if it's the first question set 1
  const swipedQuestionCount = numberFromPercentage || 1;

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
    height: 80,
    borderRadius: 20,
    backgroundColor: '#F1F3FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  name: {
    textTransform: 'uppercase',
  },
  text: {
    color: '#B6B6BD',
    marginTop: 5,
  },
});
