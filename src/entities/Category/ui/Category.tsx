import React, {memo, MutableRefObject} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Gradient, GradientSize} from '@src/shared/ui/Gradient/Gradient';
import {useColors} from '@src/app/providers/colorsProvider';
import {DisplayText, StyleType} from '@src/shared/types/types';
import {getShadowOpacity, globalStyles} from '@src/app/styles/GlobalStyle';
import {LockIcon} from '@src/shared/assets/icons/Lock';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {sessionStore} from '@src/entities/Session';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {LockedIcon} from '@src/shared/assets/icons/Locked';
import {useTheme} from '@src/app/providers/themeProvider';
import {CategoryKey, CateorySize} from '../model/types/categoryTypes';
import categoryStore from '../model/store/categoryStore';

interface CategoryProps {
  style?: StyleType;
  name: CategoryKey;
  image: string;
  size?: CateorySize;
  isBlocked: boolean;
  id: string;
  isCategoryDetailsVisible: boolean;
  displayName: DisplayText;
  isLoading?: boolean;
  isActionDisabled?: MutableRefObject<boolean>;
}

const sizeM = 120;
const sizel = 210;
const sizeXl = 200;
const borderRadius = moderateScale(20);

const Category = (props: CategoryProps) => {
  const {
    image,
    size = CateorySize.L,
    isBlocked = false,
    id,
    isCategoryDetailsVisible,
    style,
    displayName,
    isLoading = false,
    isActionDisabled,
    name,
  } = props;
  const colors = useColors();
  const {theme} = useTheme();
  const {t, i18n} = useTranslation();

  const sessionsCount = sessionStore.getUserSessionsCount();
  const isContentLocked = categoryStore.checkContentLock(name);

  const language = i18n.language as LanguageValueType;
  const isSizeL = size === CateorySize.L;

  const onCategoryPressHandler = () => {
    categoryStore.categoryPressHandler({
      displayName: displayName[language],
      categoryId: id,
      isActionDisabled: isActionDisabled?.current,
      isCategoryDetailsVisible,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.carouseTopBlock}>
        {size === CateorySize.M ? (
          <Skeleton width={'100%'} height={sizeM} borderRadius={borderRadius} />
        ) : size === CateorySize.L ? (
          <Skeleton width={'100%'} height={sizel} borderRadius={borderRadius} />
        ) : (
          <Skeleton
            width={'100%'}
            height={sizeXl}
            borderRadius={borderRadius}
          />
        )}
      </View>
    );
  }

  return (
    <Pressable onPress={onCategoryPressHandler}>
      {isContentLocked && (
        <>
          <View
            style={[
              styles.layout,
              styles[size],
              {
                backgroundColor: colors.bgLayout,
              },
            ]}
          />
          <View style={[styles.lockIconWrapper]}>
            <SvgXml
              xml={LockIcon}
              fill={colors.white}
              height={isSizeL ? 60 : 35}
              width={isSizeL ? 40 : 27}
            />
          </View>
        </>
      )}
      <View
        style={{
          ...getShadowOpacity(theme).shadowOpacity_level_2,
        }}>
        <FastImage
          resizeMode="cover"
          style={[
            styles.category,
            styles[size],
            style,
            {
              padding: isSizeL ? 20 : 10,
              ...getShadowOpacity(theme).shadowOpacity_level_2,
            },
          ]}
          source={{
            uri: image,
          }}>
          <View style={styles.headerSection}>
            <Gradient size={GradientSize.SMALL}>
              <AppText
                style={{color: colors.white}}
                weight={'500'}
                size={isSizeL ? TextSize.LEVEL_6 : TextSize.LEVEL_3}
                text={`${sessionsCount} ${t('sessions.sessions')}`}
              />
            </Gradient>
            {isBlocked && (
              <SvgXml
                xml={LockedIcon}
                style={[
                  {
                    width: horizontalScale(isSizeL ? 30 : 22),
                    height: horizontalScale(isSizeL ? 40 : 26),
                  },
                ]}
              />
            )}
          </View>
          <AppText
            style={[
              styles.status,
              {color: colors.categoryAndFavoritesTextColor},
            ]}
            weight={'700'}
            size={isSizeL ? TextSize.LEVEL_7 : TextSize.LEVEL_4}
            text={displayName[language]}
          />
        </FastImage>
      </View>
    </Pressable>
  );
};

export default memo(Category);

const styles = StyleSheet.create<Record<string, any>>({
  category: {
    borderRadius: borderRadius,
  },
  image: {
    borderRadius: borderRadius,
    aspectRatio: 1 / 2,
  },
  status: {
    marginTop: verticalScale(8),
    textTransform: 'uppercase',
  },
  layout: {
    position: 'absolute',
    width: '100%',
    borderRadius: borderRadius,
    ...globalStyles.categoryLayoutZIndex,
  },
  lockIconWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    ...globalStyles.categoryLayoutIconZIndex,
  },
  headerSection: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },

  size_m: {
    height: sizeM,
  },
  size_l: {
    height: sizel,
  },
  size_xl: {
    height: sizeXl,
  },
});
