import React, {memo} from 'react';
import {ImageSourcePropType, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';

import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {DisplayText} from '@src/shared/types/types';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {useTheme} from '@src/app/providers/themeProvider';
import {RubricType} from '@src/entities/Rubric';
import {useColors} from '@src/app/providers/colorsProvider';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {QuestionCardTypes} from '../model/types/questionTypes';
import {
  isCardTypeEmpty,
  isCardTypeWild,
  questionCardHeight,
  questionCardWidth,
} from '../model/lib/questionLib';
import {AppName, QuestionText, TopicName} from './HelperComponents';

interface QuestionCardProps {
  question: DisplayText;
  image: ImageSourcePropType;
  type: QuestionCardTypes;
  rubric?: RubricType;
}

const QuestionCard = (props: QuestionCardProps) => {
  const {question, image, type, rubric} = props;

  const {i18n} = useTranslation();
  const {theme} = useTheme();
  const colors = useColors();

  const language = i18n.language as LanguageValueType;
  const translatedQuestion = question[language];

  if (isCardTypeEmpty(type)) {
    return <></>;
  }

  if (isCardTypeWild(type)) {
    return (
      <Gradient
        style={[
          styles.questionCard,
          {...getShadowOpacity(theme).shadowOpacity_level_2},
        ]}>
        <FastImage
          resizeMode="stretch"
          source={image as number}
          style={styles.questionCard}>
          <TopicName type={type} rubric={rubric} language={language} />
          <QuestionText type={type} translatedQuestion={translatedQuestion} />
          <AppName type={type} />
        </FastImage>
      </Gradient>
    );
  }

  return (
    <View style={{...getShadowOpacity(theme).shadowOpacity_level_2}}>
      <FastImage
        resizeMode="stretch"
        source={image as number}
        style={[styles.questionCard, {backgroundColor: colors.white}]}>
        <TopicName type={type} rubric={rubric} language={language} />
        <QuestionText type={type} translatedQuestion={translatedQuestion} />
        <AppName type={type} />
      </FastImage>
    </View>
  );
};

const styles = StyleSheet.create({
  questionCard: {
    height: verticalScale(questionCardHeight),
    width: horizontalScale(questionCardWidth),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(40),
  },
});

export default memo(QuestionCard);
