import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {globalStyles} from '@src/app/styles/GlobalStyle';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {getNumberFromPercentage} from '@src/shared/lib/common';
import {RubricType} from '../model/types/rubricTypes';

interface RubricProps {
  rubric: RubricType;
}

export const Rubric = (props: RubricProps) => {
  const {rubric} = props;
  const colors = useColors();
  const swipedQuestionCount = getNumberFromPercentage(
    rubric.swipedQuestionsPercentage,
    rubric.questions.length,
  );

  return (
    <View style={[styles.Rubric, {...globalStyles.simpleShadowOpacity}]}>
      <View>
        <AppText
          style={[styles.name, {color: colors.primaryTextColor}]}
          weight={'600'}
          size={TextSize.LEVEL_4}
          text={rubric.name}
        />
        <AppText
          style={[styles.text]}
          size={TextSize.LEVEL_2}
          text={rubric.description}
        />
      </View>
      <View>
        <GradientText
          style={{color: colors.primaryTextColor}}
          weight={'700'}
          size={TextSize.LEVEL_3}
          text={`${Math.ceil(swipedQuestionCount)}/${rubric.questions.length}`}
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
