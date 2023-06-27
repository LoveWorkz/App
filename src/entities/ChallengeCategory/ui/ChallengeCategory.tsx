import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';

import {getShadowOpacity, globalStyles} from '@src/app/styles/GlobalStyle';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {LockIcon} from '@src/shared/assets/icons/Lock';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {DisplayText} from '@src/shared/types/types';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {useTheme} from '@src/app/providers/themeProvider';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {ChallengeCategoryKeys} from '../model/types/challengeCategory';

interface ChallangeProps {
  image?: string;
  name?: ChallengeCategoryKeys;
  isActive?: boolean;
  selectChallngeCategory?: (data: {id: string; name: string}) => void;
  isBlocked?: boolean;
  number?: string;
  id?: string;
  displayName?: DisplayText;
  defaultChallengeId?: string;
  isHomePage?: boolean;
  isLoading?: boolean;
}

const challengeWidth = horizontalScale(60);
const borderRadius = moderateScale(40);

const ChallengeCategory = (props: ChallangeProps) => {
  const {
    defaultChallengeId,
    image,
    name,
    isActive = false,
    selectChallngeCategory,
    isBlocked = true,
    number,
    id,
    displayName,
    isHomePage = false,
    isLoading = false,
  } = props;
  const colors = useColors();
  const {i18n} = useTranslation();
  const {theme} = useTheme();
  const language = i18n.language as LanguageValueType;
  const [isSkeleton, setIsSkeleton] = useState(true);

  useEffect(() => {
    setIsSkeleton(isLoading);
  }, [isLoading]);

  // select default challenge category
  useFocusEffect(
    useCallback(() => {
      if (defaultChallengeId && name && selectChallngeCategory) {
        if (defaultChallengeId !== id) {
          return;
        }

        selectChallngeCategory({id, name});
      }
    }, [defaultChallengeId, name, selectChallngeCategory, id]),
  );

  const onPressHandler = useCallback(() => {
    if (isBlocked) {
      navigation.navigate(TabRoutesNames.SHOP);
      return;
    }

    if (isHomePage) {
      // when press on challenge category in home page navigate to Challenges page and set selected challenge id
      navigation.navigate(TabRoutesNames.CHALLENGES, {id});

      return;
    }

    if (id && name && selectChallngeCategory) {
      selectChallngeCategory({id, name});
    }
  }, [selectChallngeCategory, id, name, isBlocked, isHomePage]);

  const uri = useMemo(() => {
    return {
      uri: image,
      priority: FastImage.priority.normal,
      resizeMode: FastImage.resizeMode.contain,
    };
  }, [image]);

  const fastImage = (
    <FastImage
      resizeMode="contain"
      onLoadEnd={() => setIsSkeleton(false)}
      style={[
        name === ChallengeCategoryKeys.Bronze
          ? {
              right: horizontalScale(1),
              top: horizontalScale(2),
            }
          : {},
        styles.image,
      ]}
      source={uri}
    />
  );

  if (number) {
    return (
      <View
        style={[
          styles.challange,
          {
            ...getShadowOpacity(theme).shadowOpacity_level_2,
            backgroundColor: colors.bgQuinaryColor,
          },
        ]}>
        <View
          style={[
            styles.content,
            {backgroundColor: colors.bgChallengeContentColor},
          ]}>
          {isActive ? (
            <AppText
              style={[{color: colors.primaryTextColor}]}
              weight={'700'}
              size={TextSize.LEVEL_7}
              text={number}
            />
          ) : (
            <GradientText
              weight={'700'}
              size={TextSize.LEVEL_7}
              text={number}
            />
          )}
        </View>
      </View>
    );
  }

  if (isSkeleton) {
    return (
      <View style={styles.skeleton}>
        <Skeleton
          width={challengeWidth}
          height={challengeWidth}
          borderRadius={borderRadius}
        />
        <View style={styles.nameSkeleton}>
          <Skeleton width={30} height={10} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.challangeWrapper}>
      {isActive ? (
        <Gradient
          style={[
            styles.challange,
            {...getShadowOpacity(theme).shadowOpacity_level_2},
          ]}>
          <TouchableOpacity onPress={onPressHandler}>
            <View
              style={[
                styles.content,
                {backgroundColor: colors.bgChallengeContentColor},
              ]}>
              {fastImage}
            </View>
          </TouchableOpacity>
        </Gradient>
      ) : (
        <TouchableOpacity onPress={onPressHandler}>
          <View
            style={[
              styles.challange,
              {
                ...getShadowOpacity(theme).shadowOpacity_level_2,
                backgroundColor: colors.bgTertiaryColor,
              },
            ]}>
            <View
              style={[
                styles.content,
                {backgroundColor: colors.bgChallengeContentColor},
              ]}>
              {fastImage}
            </View>
          </View>
          {isBlocked && (
            <>
              <View style={[styles.layout]} />
              <View style={[styles.lockIconWrapper]}>
                <SvgXml
                  xml={LockIcon}
                  fill={colors.white}
                  style={styles.lockIcon}
                />
              </View>
            </>
          )}
        </TouchableOpacity>
      )}
      {displayName && (
        <AppText
          style={[styles.name, {color: colors.challengeCategoryNameColor}]}
          weight={'500'}
          size={TextSize.LEVEL_1}
          text={displayName[language]}
        />
      )}
    </View>
  );
};

export default memo(ChallengeCategory);

const styles = StyleSheet.create<Record<string, any>>({
  challangeWrapper: {
    alignItems: 'center',
  },
  challange: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    height: challengeWidth,
    width: challengeWidth,
    backgroundColor: 'white',
    borderRadius: borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#F1F3FF',
    height: horizontalScale(50),
    width: horizontalScale(50),
    borderRadius: borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(3),
    paddingHorizontal: horizontalScale(3),
  },
  text: {
    color: 'black',
  },
  active: {
    backgroundColor: 'black',
  },
  activeText: {
    color: 'white',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  name: {
    marginVertical: verticalScale(5),
  },

  layout: {
    backgroundColor: 'black',
    position: 'absolute',
    opacity: 0.2,
    width: '100%',
    height: '100%',
    borderRadius: borderRadius,
    ...globalStyles.challengeLayoutZIndex,
  },
  lockIconWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    ...globalStyles.challengeLayoutIconZIndex,
  },
  lockIcon: {
    height: verticalScale(27),
    width: horizontalScale(25),
  },

  skeleton: {
    alignItems: 'center',
  },
  nameSkeleton: {
    marginTop: 5,
  },
});
