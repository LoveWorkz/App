import React from 'react';
import {StyleSheet, View} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {APPLICATION_NAME} from '@src/app/config/appConfig';
import {RubricType} from '@src/entities/Rubric';
import {QuestionCardTypes} from '../model/types/questionTypes';
import {isCardTypeOrdinary, isCardTypeWild, isHotStuff} from '../model/lib/questionLib';

interface QuestionTextProps {
  type: QuestionCardTypes;
  translatedQuestion: string;
}

export const QuestionText = React.memo((props: QuestionTextProps) => {
  const {type, translatedQuestion} = props;

  const colors = useColors();
  const questionTextSize =
    translatedQuestion.length < 150 ? TextSize.LEVEL_6 : TextSize.LEVEL_5;

  return (
    <AppText
      style={{
        color:
          isCardTypeOrdinary(type) ? colors.primaryTextColor : colors.white,
      }}
      align={'center'}
      weight={'700'}
      size={questionTextSize}
      text={translatedQuestion}
    />
  );
});

interface TopicNameProps {
  language: LanguageValueType;
  rubric?: RubricType;
  type: QuestionCardTypes;
}

export const TopicName = React.memo((props: TopicNameProps) => {
  const {rubric, language, type} = props;

  const colors = useColors();
  const topicName = rubric?.displayName?.[language] ?? null;
  const isTopicHotStuff = isHotStuff(rubric?.name);
  const isTypeWild = isCardTypeWild(type);

  if (isTypeWild) {
    return (
      <View style={styles.topicName}>
        <AppText
          style={{color: colors.white}}
          weight={'600'}
          size={TextSize.LEVEL_2}
          text={'Wild Card'}
        />
      </View>
    );
  }

  return topicName ? (
    <View style={styles.topicName}>
      {isTopicHotStuff ? (
        <AppText
          style={{color: colors.red}}
          weight={'600'}
          size={TextSize.LEVEL_2}
          text={topicName}
        />
      ) : (
        <GradientText weight={'600'} size={TextSize.LEVEL_2} text={topicName} />
      )}
    </View>
  ) : null;
});

interface AppNameProps {
  type: QuestionCardTypes;
}

export const AppName = React.memo((props: AppNameProps) => {
  const {type} = props;

  const colors = useColors();
  const isTypeWild = isCardTypeWild(type);

  return (
    <View style={styles.appName}>
      {isTypeWild ? (
        <AppText
          style={{color: colors.white}}
          weight={'600'}
          size={TextSize.LEVEL_2}
          text={`...${APPLICATION_NAME}`}
        />
      ) : (
        <GradientText
          weight={'600'}
          size={TextSize.LEVEL_2}
          text={`...${APPLICATION_NAME}`}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  topicName: {
    position: 'absolute',
    top: horizontalScale(20),
    left: horizontalScale(20),
  },
  appName: {
    position: 'absolute',
    right: horizontalScale(20),
    bottom: horizontalScale(20),
  },
});
