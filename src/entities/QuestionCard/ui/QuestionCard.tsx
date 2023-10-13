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
import {Button} from '@src/shared/ui/Button/Button';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {QuestionCardTypes} from '../model/types/questionTypes';

interface QuestionCardProps {
  question: DisplayText;
  image: ImageSourcePropType;
  type: QuestionCardTypes;
  challengeId?: string;
}

const QuestionCard = (props: QuestionCardProps) => {
  const {question, image, type, challengeId} = props;

  const colors = useColors();
  const {i18n} = useTranslation();
  const {theme} = useTheme();

  const isTypeOrdinary = type === 'ORDINARY';
  const isTypeChallangeCard = type === 'CHALLANGE_CARD';
  const isTextPrimary = isTypeOrdinary || isTypeChallangeCard;

  const language = i18n.language as LanguageValueType;

  const onButtonPressHandler = () => {
    navigation.navigate(TabRoutesNames.CHALLENGES, {id: challengeId});
  };

  return (
    <View style={{...getShadowOpacity(theme).shadowOpacity_level_2}}>
      <FastImage
        resizeMode="stretch"
        source={image as number} // image number
        style={styles.questionCard}>
        <View style={styles.btnWrapper}>
          {isTypeChallangeCard && (
            <Button onPress={onButtonPressHandler}>
              <AppText size={TextSize.LEVEL_4} text={'button'} />
            </Button>
          )}
          <AppText
            style={[
              styles.questionText,
              {color: isTextPrimary ? colors.primaryTextColor : colors.white},
            ]}
            weight={'600'}
            size={TextSize.LEVEL_7}
            text={question[language]}
          />
        </View>
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
  btnWrapper: {
    position: 'relative',
  },
});

export default memo(QuestionCard);
