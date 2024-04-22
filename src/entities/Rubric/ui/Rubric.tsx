import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';

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
import { isPlatformIos } from '@src/shared/consts/common';
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

  const source = useMemo(() => {
    return {
      uri: rubric.image,
      priority: FastImage.priority.normal,
    };
  }, [rubric.image]);

  return (
    <View
      style={[
        styles.Rubric,
        {
          ...getShadowOpacity(theme).shadowOpacity_level_1,
          backgroundColor: colors.bgSecondaryColor,
        },
      ]}>
      <View style={styles.leftSide}>
        <View style={styles.nameWrapper}>
          <AppText
            style={[styles.name, {color: colors.primaryTextColor}]}
            weight={'600'}
            size={TextSize.LEVEL_4}
            text={displayName[language]}
          />
          <GradientText
            weight={'700'}
            size={TextSize.LEVEL_3}
            text={`${swipedQuestionCount}/${questions.length}`}
          />
        </View>
        <AppText
          style={[styles.text, {color: colors.topicDescriptionColor}]}
          size={TextSize.LEVEL_3}
          text={description[language]}
        />
      </View>
      {rubric.image && <FastImage style={styles.image} source={source} />}
    </View>
  );
};

export default memo(Rubric);

const styles = StyleSheet.create({
  Rubric: {
    borderRadius: borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(15),
  },
  leftSide: {
    width: '70%',
  },
  nameWrapper: {
    flexDirection: 'row',
  },
  name: {
    textTransform: 'uppercase',
    marginRight: horizontalScale(10),
  },
  text: {
    color: '#B6B6BD',
    marginTop: verticalScale(5),
  },
  image: {
    height: horizontalScale(70),
    width: horizontalScale(70),
    borderRadius: moderateScale(50),
  },
});
