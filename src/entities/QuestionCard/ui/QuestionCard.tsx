import React, {memo} from 'react';
import {ImageSourcePropType, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {getShadowOpacity, windowWidth} from '@src/app/styles/GlobalStyle';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {DisplayText} from '@src/shared/types/types';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {useTheme} from '@src/app/providers/themeProvider';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {QuestionCardTypes} from '../model/types/questionTypes';

interface QuestionCardProps {
  question: DisplayText;
  image: ImageSourcePropType;
  type: QuestionCardTypes;
  challenge?: string;
}

const QuestionCard = (props: QuestionCardProps) => {
  const {question, image, type, challenge} = props;

  const colors = useColors();
  const {t, i18n} = useTranslation();
  const {theme} = useTheme();

  const isTypeOrdinary = type === 'ORDINARY_CARD';
  const isTypeChallange = type === 'CHALLENGE_CARD';
  const isTextPrimary = isTypeOrdinary;

  const language = i18n.language as LanguageValueType;
  const isGerman = language === 'de';

  const translatedQuestion = question[language];

  const questionTextSize =
    translatedQuestion.length < 150 ? TextSize.LEVEL_7 : TextSize.LEVEL_5;

  const onButtonPressHandler = () => {
    navigation.navigate(TabRoutesNames.CHALLENGES, {challenge: challenge});
  };

  return (
    <View style={{...getShadowOpacity(theme).shadowOpacity_level_2}}>
      <FastImage
        resizeMode="stretch"
        source={image as number} // image number
        style={styles.questionCard}>
        <AppText
          style={[
            styles.questionText,
            {color: isTextPrimary ? colors.primaryTextColor : colors.white},
          ]}
          weight={'600'}
          size={questionTextSize}
          text={translatedQuestion}
        />

        {isTypeChallange && (
          <Button
            style={[
              styles.btn,
              {
                backgroundColor: colors.white,
                paddingVertical: horizontalScale(isGerman ? 3 : 8),
              },
            ]}
            theme={ButtonTheme.CLEAR}
            onPress={onButtonPressHandler}>
            <GradientText
              style={styles.btnText}
              size={isGerman ? TextSize.LEVEL_4 : TextSize.LEVEL_5}
              weight={'700'}
              text={t('questions.move_to_challenges')}
            />
          </Button>
        )}
      </FastImage>
    </View>
  );
};

const styles = StyleSheet.create({
  questionCard: {
    height: verticalScale(450),
    width: windowWidth * 0.88,
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(40),
  },
  questionText: {
    textAlign: 'center',
  },
  btn: {
    height: 'auto',
    marginTop: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
    borderRadius: moderateScale(10),
  },
  btnText: {
    textAlign: 'center',
  },
});

export default memo(QuestionCard);
