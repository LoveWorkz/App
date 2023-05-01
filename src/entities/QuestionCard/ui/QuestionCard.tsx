import React, {memo} from 'react';
import {ImageSourcePropType, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

import {useColors} from '@src/app/providers/colorsProvider';
import {globalStyles, windowWidth} from '@src/app/styles/GlobalStyle';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

interface QuestionCardProps {
  question: string;
  image: ImageSourcePropType;
  type: string;
}

const QuestionCard = (props: QuestionCardProps) => {
  const {question, image, type} = props;
  const isTypeOrdinary = type === 'ORDINARY';

  const colors = useColors();

  return (
    <FastImage
      resizeMode="cover"
      source={image as number}
      style={styles.questionsCard}>
      <AppText
        style={[
          styles.questionText,
          {color: isTypeOrdinary ? colors.primaryTextColor : 'white'},
        ]}
        weight={'600'}
        size={TextSize.LEVEL_7}
        text={question}
      />
    </FastImage>
  );
};

const styles = StyleSheet.create({
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

  slideItemStyle: {
    zIndex: 1,
  },
  questionText: {
    textAlign: 'center',
    position: 'relative',
  },
});

export default memo(QuestionCard);
