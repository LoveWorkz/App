import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {useColors} from '@src/app/providers/colorsProvider';
import {HeartIconWithoutColor} from '@src/shared/assets/icons/Heart';
import {ShareIcon} from '@src/shared/assets/icons/Share';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {favoriteStore} from '@src/entities/Favorite';
import {questionStore} from '@src/entities/QuestionCard';
import {Button} from '@src/shared/ui/Button/Button';
import {shareStore} from '@src/features/Share';
import {Spinner} from '@src/shared/ui/Spinner/Spinner';
import {useGradient} from '@src/app/providers/GradientProvider';

const QuestionsHeaderRight = () => {
  const colors = useColors();
  const {isGradient} = useGradient();

  const question = questionStore.question;
  const isQuestionFavorite = favoriteStore.isFavorite;
  const isUploadingImageToStorage = shareStore.isUploadingImageToStorage;

  useFocusEffect(
    useCallback(() => {
      if (!question) {
        return;
      }

      favoriteStore.setIsFavorite({id: question.id, favoriteKey: 'question'});
    }, [question]),
  );

  const toggleFavorite = () => {
    const id = question?.id;
    id && favoriteStore.toggleFavorite(id, 'question');
  };

  const onShareHandler = async () => {
    shareStore.shareQuestion();
  };

  return (
    <View style={styles.QuestionsHeaderRight}>
      <Button style={styles.shareWrapper} onPress={onShareHandler}>
        <SvgXml
          xml={ShareIcon}
          stroke={isGradient ? colors.white : colors.primaryTextColor}
          style={styles.shareIcon}
        />
      </Button>
      <Button style={styles.favoriteWrapper} onPress={toggleFavorite}>
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
            stroke={isGradient ? colors.white : colors.primaryTextColor}
            style={styles.HeartIcon}
          />
        )}
      </Button>
      <Spinner visible={isUploadingImageToStorage} />
    </View>
  );
};

export default memo(observer(QuestionsHeaderRight));

const styles = StyleSheet.create({
  QuestionsHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareWrapper: {
    paddingRight: horizontalScale(10),
  },
  shareIcon: {
    height: verticalScale(15),
    width: horizontalScale(20),
  },

  favoriteWrapper: {
    paddingLeft: horizontalScale(10),
  },
  HeartIcon: {
    height: verticalScale(18),
    width: horizontalScale(20),
  },
});
