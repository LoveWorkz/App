import React, {memo} from 'react';
import {ImageSourcePropType, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {globalStyles, windowWidth} from '@src/app/styles/GlobalStyle';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {DisplayText} from '@src/shared/types/types';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';

interface QuestionCardProps {
  question: DisplayText;
  image: ImageSourcePropType;
  type: string;
}

const QuestionCard = (props: QuestionCardProps) => {
  const {question, image, type} = props;
  const isTypeOrdinary = type === 'ORDINARY';

  const colors = useColors();
  const {i18n} = useTranslation();
  const language = i18n.language as LanguageValueType;

  return (
    <View style={styles.questionCardWrapper}>
      <FastImage
        resizeMode="stretch"
        source={image as number} // image number
        style={styles.questionCard}>
        <AppText
          style={[
            styles.questionText,
            {color: isTypeOrdinary ? colors.primaryTextColor : colors.white},
          ]}
          weight={'600'}
          size={TextSize.LEVEL_7}
          text={question[language]}
        />
      </FastImage>
    </View>
  );
};

const styles = StyleSheet.create({
  questionCardWrapper: {
    ...globalStyles.shadowOpacity,
  },
  questionCard: {
    height: verticalScale(450),
    width: windowWidth * 0.88,
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(40),
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
