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
import {StarRatings} from '@src/shared/ui/StarRatings/StarRatings';
import {RatingKeys} from '../model/types/completionTypes';
import FeedbackBlock from './FeedbackBlock';
import completionPageStore from '../model/store/completionPageStore';

interface CompletionItemProps {
  handleNext: () => void;
  id: string;
  image: number;
  pageNumber: number;
  question: string;
  prefix: string;
  postfix: string;
  setValue: (value: string | number) => void;
  value: string | number;
  pagekey: RatingKeys;
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
  } = props;
  const colors = useColors();

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
    completionPageStore.sendRatingResult();
  }, []);

  return (
    <View>
      <FastImage style={styles.image} resizeMode={'cover'} source={image} />
      <View style={styles.content}>
        <View style={styles.contentTop}>
          <View style={styles.titleWrapper}>
            <AppText
              weight="900"
              style={textSize}
              size={TextSize.LEVEL_9}
              text={'Fantastic!'}
            />
          </View>
          <AppText
            weight="500"
            align={'center'}
            style={textSize}
            size={TextSize.LEVEL_5}
            text={
              'You’ve finished your 1st session of 4 sessions on the Basic level'
            }
          />
        </View>

        {pagekey === 'feedback' ? (
          <View style={styles.feedbackWrapper}>
            <FeedbackBlock
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
  content: {
    alignItems: 'center',
  },
  contentTop: {
    top: verticalScale(-20),
    marginBottom: verticalScale(60),
    alignItems: 'center',
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
    alignItems: 'center',
    paddingHorizontal: horizontalScale(40),
  },
  starsWrapper: {
    alignItems: 'center',
    paddingHorizontal: horizontalScale(50),
  },
});
