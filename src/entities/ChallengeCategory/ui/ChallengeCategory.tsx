import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import {BlurView} from '@react-native-community/blur';

import {getShadowOpacity, globalStyles} from '@src/app/styles/GlobalStyle';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {DisplayText} from '@src/shared/types/types';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {useTheme} from '@src/app/providers/themeProvider';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {CategoryKey} from '@src/entities/Category';
import {LockedIcon} from '@src/shared/assets/icons/Locked';
import {inAppPurchaseStore} from '@src/features/InAppPurchase';

type ChallengeCategorySize = 'large' | 'small';

interface ChallangeProps {
  image?: string;
  name?: CategoryKey;
  isActive?: boolean;
  selectChallngeCategory?: (data: {id: string; name: string}) => void;
  isBlocked?: boolean;
  id?: string;
  displayName?: DisplayText;
  defaultChallengeId?: string;
  isHomePage?: boolean;
  isLoading?: boolean;
  size?: ChallengeCategorySize;
}

const challengeWidth = horizontalScale(60);
const largeChallengeWidth = horizontalScale(80);
const challangeImgWidth = challengeWidth - 10;
const largeChallangeImgWidth = largeChallengeWidth - 10;

const borderRadius = moderateScale(40);

const ChallengeCategory = (props: ChallangeProps) => {
  const {
    defaultChallengeId,
    image,
    name,
    isActive = false,
    selectChallngeCategory,
    isBlocked = true,
    id,
    displayName,
    isHomePage = false,
    isLoading = false,
    size = 'small',
  } = props;
  const colors = useColors();
  const {i18n} = useTranslation();
  const {theme} = useTheme();
  const language = i18n.language as LanguageValueType;
  const [isSkeleton, setIsSkeleton] = useState(true);

  const isLarge = size === 'large';

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
      inAppPurchaseStore.setIsInAppPurchaseModalVisible(true);
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
    };
  }, [image]);

  const fastImage = (
    <View style={[isLarge ? styles.largeImgWrapper : styles.imgWrapper]}>
      <FastImage
        onLoadEnd={() => setIsSkeleton(false)}
        style={styles.image}
        source={uri}
      />
    </View>
  );

  const mode = useMemo(() => {
    return [
      styles.challange,
      {...getShadowOpacity(theme).shadowOpacity_level_2},
      styles[size],
    ];
  }, [size, theme]);

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
        <Gradient style={mode}>
          <TouchableOpacity onPress={onPressHandler}>
            {fastImage}
          </TouchableOpacity>
        </Gradient>
      ) : (
        <TouchableOpacity onPress={onPressHandler}>
          <View
            style={[
              mode,
              {
                backgroundColor: colors.bgTertiaryColor,
              },
            ]}>
            {fastImage}
          </View>
          {isBlocked && (
            <>
              <BlurView
                style={styles.layout}
                blurType="xlight"
                blurAmount={1}
              />
              <View style={[styles.lockIconWrapper]}>
                <SvgXml
                  xml={LockedIcon}
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
    borderRadius: borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
  },
  imgWrapper: {
    width: challangeImgWidth,
    height: challangeImgWidth,
    borderRadius: borderRadius,
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: borderRadius,
  },
  name: {
    marginVertical: verticalScale(5),
  },
  layout: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.8,
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

  large: {
    height: largeChallengeWidth,
    width: largeChallengeWidth,
  },
  largeImgWrapper: {
    height: largeChallangeImgWidth,
    width: largeChallangeImgWidth,
  },
});
