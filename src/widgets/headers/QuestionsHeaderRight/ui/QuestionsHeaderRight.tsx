import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {observer} from 'mobx-react-lite';

import {useColors} from '@src/app/providers/colorsProvider';
import {HeartIcon} from '@src/shared/assets/icons/Heart';
import {ShareIcon} from '@src/shared/assets/icons/Share';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {favoriteStore} from '@src/entities/Favorite';
import {questionStore} from '@src/entities/QuestionCard';
import {Button} from '@src/shared/ui/Button/Button';
import {shareStore} from '@src/features/Share';

export const QuestionsHeaderRight = () => {
  const colors = useColors();
  const question = questionStore.question;
  const isQuestionFavorite = favoriteStore.isQuestionFavorite;

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
            xml={HeartIcon}
            stroke={'red'}
            style={styles.HeartIcon}
            fill={'red'}
          />
        ) : (
          <SvgXml
            xml={HeartIcon}
            stroke={colors.primaryTextColor}
            style={styles.HeartIcon}
          />
        )}
      </Button>
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
});
