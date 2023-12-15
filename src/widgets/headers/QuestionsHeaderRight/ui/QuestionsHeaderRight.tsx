import React, {memo, useEffect} from 'react';
import {StyleSheet, TextStyle, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {observer} from 'mobx-react-lite';
import Spinner from 'react-native-loading-spinner-overlay';
import {useTranslation} from 'react-i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {HeartIconWithoutColor} from '@src/shared/assets/icons/Heart';
import {ShareIcon} from '@src/shared/assets/icons/Share';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {favoriteStore} from '@src/entities/Favorite';
import {questionStore} from '@src/entities/QuestionCard';
import {Button} from '@src/shared/ui/Button/Button';
import {shareStore} from '@src/features/Share';
import {globalStyles} from '@src/app/styles/GlobalStyle';

export const QuestionsHeaderRight = () => {
  const colors = useColors();
  const {t} = useTranslation();

  const question = questionStore.question;
  const isQuestionFavorite = favoriteStore.isQuestionFavorite;
  const isUploadingQuestionImageToStorage =
    shareStore.isUploadingQuestionImageToStorage;

  useEffect(() => {
    if (!question) {
      return;
    }

    favoriteStore.setIsQuestionFavorite(question.id);
  }, [question]);

  const toggleFavorite = () => {
    favoriteStore.toggleFavorite();
  };

  const onShareHandler = async () => {
    shareStore.shareQuestion();
  };

  return (
    <View style={styles.QuestionsHeaderRight}>
      <Button onPress={onShareHandler}>
        <SvgXml
          xml={ShareIcon}
          stroke={colors.primaryTextColor}
          style={styles.shareIcon}
        />
      </Button>
      <Button onPress={toggleFavorite}>
        {isQuestionFavorite ? (
          <SvgXml
            xml={HeartIconWithoutColor}
            stroke={'red'}
            style={styles.HeartIcon}
            fill={'red'}
          />
        ) : (
          <SvgXml
            xml={HeartIconWithoutColor}
            stroke={colors.primaryTextColor}
            style={styles.HeartIcon}
          />
        )}
      </Button>
      <Spinner
        visible={isUploadingQuestionImageToStorage}
        textContent={`${t('loading')}...`}
        textStyle={
          [
            styles.spinnerTextStyle,
            {color: colors.primaryTextColor},
          ] as TextStyle
        }
      />
    </View>
  );
};

export default memo(observer(QuestionsHeaderRight));

const styles = StyleSheet.create({
  QuestionsHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareIcon: {
    height: verticalScale(15),
    width: horizontalScale(20),
    marginRight: horizontalScale(20),
  },

  HeartIcon: {
    height: verticalScale(18),
    width: horizontalScale(20),
  },

  spinnerTextStyle: {
    ...globalStyles.textFont,
    ...globalStyles.size_6,
  },
});
