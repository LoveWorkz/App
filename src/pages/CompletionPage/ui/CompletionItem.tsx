import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {PillContainer} from '@src/shared/ui/PillContainer/PillContainer';
import {windowWidth} from '@src/app/styles/GlobalStyle';
import {StarRatings} from '@src/shared/ui/StarRatings/StarRatings';
import {RatingKeys} from '../model/types/completionTypes';
import FeedbackBlock from './FeedbackBlock';
import completionPageStore from '../model/store/completionPageStore';

interface CompletionItemProps {
  handleNext: () => void;
  id: string;
  image: string;
  pageNumber: number;
  question: string;
  prefix: string;
  postfix: string;
  setValue: (value: string | number) => void;
  value: string | number;
  pagekey: RatingKeys;
  description: string;
  isSending: boolean;
  isQuadrant: boolean;
}

const CompletionItem = (props: CompletionItemProps) => {
  const {
    handleNext,
    image,
    pageNumber,
    question,
    prefix,
    postfix,
    setValue,
    value,
    pagekey,
    description,
    isSending,
    isQuadrant,
  } = props;
  const colors = useColors();

  const isFeedbackPage = pagekey === 'feedback';

  const textSize = useMemo(() => {
    return {color: colors.white};
  }, [colors]);

  const onRateHandler = useCallback(
    (newRating: number) => {
      setValue(newRating);
      handleNext();
    },
    [handleNext],
  );

  const onFeedbackChangeHandler = useCallback((value: string) => {
    setValue(value);
  }, []);

  const onSendPressHandler = useCallback(() => {
    completionPageStore.sendRatingResults();
  }, []);

  const source = useMemo(() => {
    return {uri: image};
  }, [image]);

  const marginBottom = isQuadrant ? 0 : verticalScale(60);

  return (
    <View>
      {isQuadrant ? (
        <FastImage
          style={styles.quadrantImage}
          resizeMode={'contain'}
          source={source}
        />
      ) : (
        <FastImage style={styles.image} resizeMode={'cover'} source={source} />
      )}
      <View style={isQuadrant ? styles.quadrantContent : styles.content}>
        <View
          style={[
            styles.contentTop,
            {
              marginBottom,
              top: isQuadrant ? 0 : verticalScale(-20),
            },
          ]}>
          <View style={styles.titleWrapper}>
            {isQuadrant ? (
              <AppText
                weight="900"
                style={textSize}
                size={TextSize.LEVEL_9}
                text={'Great Job!!'}
              />
            ) : (
              <AppText
                weight="900"
                style={textSize}
                size={TextSize.LEVEL_9}
                text={'Fantastic!'}
              />
            )}
          </View>
          <AppText
            weight="500"
            align={'center'}
            style={textSize}
            size={TextSize.LEVEL_5}
            text={description}
          />
        </View>

        {isQuadrant && !isFeedbackPage && (
          <View style={styles.contentMiddle}>
            <AppText
              weight="500"
              align={'center'}
              style={textSize}
              size={TextSize.LEVEL_5}
              text={'Next Step: Friendship'}
            />
          </View>
        )}

        {isFeedbackPage ? (
          <View style={styles.feedbackWrapper}>
            <FeedbackBlock
              isSending={isSending}
              onSendPressHandler={onSendPressHandler}
              onFeedbackChangeHandler={onFeedbackChangeHandler}
              value={value as string}
            />
          </View>
        ) : (
          <View style={styles.starsWrapper}>
            <PillContainer style={styles.pageNumberWrapper}>
              <AppText
                weight="500"
                align={'center'}
                style={textSize}
                size={TextSize.LEVEL_4}
                text={`${pageNumber}/5`}
              />
            </PillContainer>

            <View style={styles.description}>
              <AppText
                weight="500"
                align={'center'}
                style={textSize}
                size={TextSize.LEVEL_5}
                text={question}
              />
            </View>

            <View>
              <StarRatings
                imageSize={25}
                count={value as number}
                horizontalPaddings={17}
                prefix={prefix}
                postfix={postfix}
                onRate={onRateHandler}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(CompletionItem);

const styles = StyleSheet.create({
  image: {
    height: verticalScale(320),
  },
  quadrantImage: {
    height: verticalScale(470),
    width: windowWidth,
  },

  content: {
    alignItems: 'center',
  },
  quadrantContent: {
    alignItems: 'center',
    top: verticalScale(-130),
  },

  contentTop: {
    alignItems: 'center',
    paddingHorizontal: horizontalScale(50),
  },
  contentMiddle: {
    marginTop: verticalScale(70),
    marginBottom: verticalScale(50),
    paddingHorizontal: horizontalScale(50),
  },
  titleWrapper: {
    marginBottom: verticalScale(10),
  },
  description: {
    paddingTop: verticalScale(10),
    paddingVertical: verticalScale(30),
  },

  pageNumberWrapper: {
    height: horizontalScale(35),
    borderRadius: moderateScale(20),
    paddingHorizontal: horizontalScale(10),
  },
  feedbackWrapper: {
    width: horizontalScale(300),
  },
  starsWrapper: {
    alignItems: 'center',
    paddingHorizontal: horizontalScale(50),
  },
});
