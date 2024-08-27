import React, {memo, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  getShadowOpacity,
  globalStyles,
  windowWidth,
  windowWidthMinusPaddings,
} from '@src/app/styles/GlobalStyle';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {useTheme} from '@src/app/providers/themeProvider';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {Badge, BadgeDark} from '@src/shared/assets/images';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {DocumentType} from '@src/shared/types/types';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {RubricType} from '../model/types/rubricTypes';
import rubricStore from '../model/store/rubricStore';
import {userStore} from '@src/entities/User';
import firebaseStorage from '@react-native-firebase/storage';

interface RubricProps {
  rubric: RubricType;
  isLoading: boolean;
  isHomeChallenge?: boolean;
}

const height = 80;
const borderRadius = moderateScale(20);

const Rubric = (props: RubricProps) => {
  const {rubric, isLoading, isHomeChallenge} = props;
  const {displayName, questions, description, currentQuestion} = rubric;
  const colors = useColors();
  const {i18n} = useTranslation();
  const {theme, isDark} = useTheme();
  const [imageUrl, setImageUrl] = React.useState('');

  const userRubricsSeen = userStore.user?.rubrics_seen;

  const language = i18n.language as LanguageValueType;

  const swipedQuestionCount = rubricStore.getQuestionNumberForRubric({
    questionIds: questions,
    currenctQuestionId: currentQuestion,
  });

  const shouldDisplayNewBanner = !userRubricsSeen?.includes(rubric.id);

  const imageVariant = isDark ? 'dark' : 'light';

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const url = await firebaseStorage()
          .ref(`topics/images/${imageVariant}/${rubric.image_name}`)
          .getDownloadURL();
        setImageUrl(url);
      } catch (error) {
        console.error('Error fetching image URL:', error);
      }
    };

    if (rubric.image_name) {
      fetchImageUrl();
    }
  }, [imageVariant, rubric.image_name]);

  const onRubricPressHandlerCreator = (id: string) => {
    return () => {
      navigation.navigate(AppRouteNames.QUESTIONS, {
        type: DocumentType.RUBRIC,
        id,
        title: displayName[language],
      });
    };
  };

  if (isLoading) {
    return (
      <View>
        <Skeleton
          height={height}
          width={windowWidthMinusPaddings}
          borderRadius={borderRadius}
        />
      </View>
    );
  }

  let content = (
    <>
      <View style={styles.leftSide}>
        <View style={styles.nameWrapper}>
          <AppText
            style={[styles.name, {color: colors.primaryTextColor}]}
            weight={'600'}
            size={TextSize.LEVEL_4}
            text={displayName[language]}
          />
        </View>
        <AppText
          size={TextSize.LEVEL_4}
          style={[styles.text, {color: colors.primaryTextColor}]}
          text={description[language]}
        />
      </View>
      <View style={styles.countWrapper}>
        <GradientText
          weight={'600'}
          size={TextSize.LEVEL_4}
          text={`${swipedQuestionCount}/${questions.length}`}
        />
      </View>
    </>
  );

  if (isHomeChallenge) {
    content = (
      <View style={styles.homeChallengeContent}>
        <GradientText
          weight={'600'}
          size={TextSize.LEVEL_2}
          text={`${swipedQuestionCount}/${questions.length}`}
        />
        <View>
          <AppText
            style={[styles.name, {color: colors.primaryTextColor}]}
            weight={'900'}
            text={displayName[language]}
          />
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onRubricPressHandlerCreator(rubric.id)}
      key={rubric.id}>
      <View
        style={[
          styles.Rubric,
          {
            ...getShadowOpacity(theme, colors.bgSecondaryColor)
              .shadowOpacity_level_1,
            backgroundColor: colors.bgSecondaryColor,
          },
        ]}>
        {shouldDisplayNewBanner && (
          <FastImage
            resizeMode="contain"
            style={styles.badgeImg}
            source={isDark ? BadgeDark : Badge}
          />
        )}
        <View style={styles.imageWrapper}>
          <FastImage style={styles.image} source={{uri: imageUrl}} />
        </View>
        {content}
      </View>
    </TouchableOpacity>
  );
};

export default memo(Rubric);

const padding = horizontalScale(10);

const styles = StyleSheet.create({
  Rubric: {
    borderRadius: borderRadius,
    flexDirection: 'row',
    overflow: 'hidden',

    paddingRight: horizontalScale(10),
    minWidth: windowWidth * 0.55,
  },
  leftSide: {
    width: '80%',
    paddingVertical: padding,
  },
  nameWrapper: {
    flexDirection: 'row',
  },
  name: {
    marginRight: horizontalScale(10),
  },
  text: {
    color: '#B6B6BD',
    marginTop: verticalScale(5),
  },
  imageWrapper: {
    padding: padding,
    paddingRight: 0,
  },
  image: {
    height: horizontalScale(55),
    width: horizontalScale(55),
    borderRadius: moderateScale(50),
  },
  countWrapper: {
    position: 'absolute',
    right: padding,
    top: padding,
  },
  badgeImg: {
    position: 'absolute',
    height: '100%',
    width: horizontalScale(60),
    top: -10,
    ...globalStyles.zIndex_1,
  },
  homeChallengeContent: {
    justifyContent: 'center',
    top: horizontalScale(-5),
    left: horizontalScale(5),
  },
});
