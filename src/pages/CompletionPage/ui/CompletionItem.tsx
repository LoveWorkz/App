import React, {memo, useCallback, useMemo} from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {PillContainer} from '@src/shared/ui/PillContainer/PillContainer';
import {
  globalPadding,
  globalStyles,
  windowWidth,
} from '@src/app/styles/GlobalStyle';
import {StyledWordText} from '@src/shared/ui/StyledWordText/StyledWordText';
import {StarRatings} from '@src/shared/ui/StarRatings/StarRatings';
import {StyleType} from '@src/shared/types/types';
import {RatingKeys} from '../model/types/completionTypes';
import FeedbackBlock from './FeedbackBlock';
import completionPageStore from '../model/store/completionPageStore';
import {keyWords} from '../model/lib/completionPageLib';
import {SvgXml} from 'react-native-svg';
import {ArrowLeftIcon} from '@src/shared/assets/icons/ArrowLeft';
import {useNavigation} from '@react-navigation/native';
import {Button} from '@src/shared/ui/Button/Button';
import {useTranslation} from 'react-i18next';

interface CompletionItemProps {
  handleNext: () => void;
  id: string;
  image: string;
  pageNumber: number;
  question: string;
  styledWords: string[];
  prefix: string;
  postfix: string;
  setValue: (value: string | number) => void;
  value: string | number;
  pagekey: RatingKeys;
  description: string;
  isSending: boolean;
  isQuadrant: boolean;
  nextStep: string;
  shouldRenderBackground?: boolean;
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
    styledWords,
    nextStep,
    shouldRenderBackground = true,
  } = props;
  const colors = useColors();
  const {goBack} = useNavigation();
  const {t} = useTranslation();

  const isFeedbackPage = pagekey === 'feedback';

  const textSize = useMemo(() => {
    return {color: colors.white};
  }, [colors]);

  const onRateHandler = useCallback(
    (newRating: number) => {
      setValue(newRating);
      handleNext();
    },
    [handleNext, setValue],
  );

  const onFeedbackChangeHandler = useCallback(
    (newValue: string) => {
      setValue(newValue);
    },
    [setValue],
  );

  const onSendPressHandler = useCallback(() => {
    completionPageStore.sendRatingResults();
  }, []);

  const source = useMemo(() => {
    return {uri: image};
  }, [image]);

  const styledWordStyle = useMemo(() => {
    const isKeyWord = keyWords.some(word => styledWords?.includes(word));
    return [isKeyWord ? styles.keyWordStyle : styles.styledWordStyle, textSize];
  }, [styledWords, textSize]);

  const marginBottom =
    !isQuadrant && !isFeedbackPage ? verticalScale(110) : verticalScale(80);

  return (
    <View>
      {isQuadrant && !isFeedbackPage && (
        <Button style={styles.arrowWrapper} onPress={goBack}>
          <SvgXml fill={colors.white} style={styles.icon} xml={ArrowLeftIcon} />
        </Button>
      )}

      <View
        style={[styles.image, !isQuadrant ? {height: verticalScale(320)} : {}]}
      />

      {shouldRenderBackground && (
        <>
          {isQuadrant ? (
            <FastImage
              style={styles.quadrantImage}
              resizeMode={'contain'}
              source={source}
            />
          ) : (
            <FastImage
              style={styles.image}
              resizeMode={'contain'}
              source={source}
            />
          )}
        </>
      )}

      <View style={isQuadrant ? styles.quadrantContent : styles.content}>
        <View
          style={[
            styles.contentTop,
            // eslint-disable-next-line react-native/no-inline-styles
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
                text={t('questions.great_job')}
              />
            ) : (
              <AppText
                weight="900"
                style={textSize}
                size={TextSize.LEVEL_9}
                text={t('common.fantastic')}
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
              text={`${t('common.next_step')}: ${nextStep}`}
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
              <StyledWordText
                style={styles.styledTextStyle}
                textStyle={[styles.textStyle, textSize]}
                text={question}
                styledWords={styledWords}
                styledWordStyle={styledWordStyle}
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

const top = verticalScale(-130);
const styledWordStyle: StyleType = {
  fontWeight: '900',
  textAlign: 'center',
  ...globalStyles.size_5,
};

const styles = StyleSheet.create({
  image: {},
  quadrantImage: {
    height: verticalScale(470),
    width: windowWidth,
    marginTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,
  },

  content: {
    alignItems: 'center',
  },
  quadrantContent: {
    alignItems: 'center',
    marginBottom: top,
    top,
  },

  contentTop: {
    alignItems: 'center',
    paddingHorizontal: horizontalScale(50),
  },
  contentMiddle: {
    marginBottom: verticalScale(40),
    paddingHorizontal: horizontalScale(50),
    marginTop: -verticalScale(20),
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

  textStyle: {
    alignItems: 'center',
    paddingHorizontal: horizontalScale(50),
    fontWeight: '500',
    textAlign: 'center',
    ...globalStyles.size_5,
  },

  styledTextStyle: {
    textAlign: 'center',
  },
  styledWordStyle: {
    ...styledWordStyle,
    textTransform: 'capitalize',
  },
  keyWordStyle: {
    ...styledWordStyle,
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
  },
  arrowWrapper: {
    paddingRight: horizontalScale(20),
    position: 'absolute',
    top: 50,
    left: globalPadding,
    zIndex: 1,
  },
  icon: {
    height: verticalScale(15),
    width: horizontalScale(18),
  },
});
