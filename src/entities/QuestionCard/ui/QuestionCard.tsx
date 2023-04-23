import React, {memo} from 'react';
import {ImageBackground, StyleSheet} from 'react-native';

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
  image: string;
  type: string;
}

const QuestionCard = (props: QuestionCardProps) => {
  const {question, image, type} = props;
  const isTypeOrdinary = type === 'ORDINARY';

  const colors = useColors();

  return (
    <ImageBackground
      resizeMode="cover"
      imageStyle={styles.imageStyle}
      source={{
        uri: image,
      }}
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
    </ImageBackground>
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
  imageStyle: {
    borderRadius: moderateScale(20),
  },
});

export default memo(QuestionCard);
