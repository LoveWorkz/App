import React, {memo, MutableRefObject, useEffect} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import {observer} from 'mobx-react-lite';
import {TFunction} from 'i18next';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {DisplayText, StyleType} from '@src/shared/types/types';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {ColorType} from '@src/app/styles/themeStyle';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {LockedIcon} from '@src/shared/assets/icons/Locked';
import PremiumBlock from '@src/shared/ui/PremiumBlock/PremiumBlock';
import {useTheme} from '@src/app/providers/themeProvider';
import {LockIconWithoutStyle} from '@src/shared/assets/icons/Lock';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {CategoryKey, CateorySize} from '../model/types/categoryTypes';
import categoryStore from '../model/store/categoryStore';

interface CategoryProps {
  style?: StyleType;
  name: CategoryKey;
  image: string;
  size?: CateorySize;
  isBlocked: boolean;
  id: string;
  displayName: DisplayText;
  isLoading?: boolean;
  isActionDisabled?: MutableRefObject<boolean>;
  isHomepage?: boolean;
  allSessionsCount: number;
  onBlockedCategoryPress?: () => void;
}

const CategorySizes = {
  [CateorySize.M]: 120,
  [CateorySize.L]: 220,
  [CateorySize.XL]: 200,
};

const borderRadius = moderateScale(20);

const Category = (props: CategoryProps) => {
  const {
    image,
    size = CateorySize.L,
    isBlocked,
    id,
    style,
    displayName,
    isLoading,
    isActionDisabled,
    name,
    isHomepage,
    allSessionsCount,
    onBlockedCategoryPress,
  } = props;

  const {t, i18n} = useTranslation();
  const {theme} = useTheme();
  const colors = useColors();
  const language = i18n.language as LanguageValueType;
  const isContentLocked = categoryStore.checkContentLock(name);
  const categorySize = CategorySizes[size] || CategorySizes[CateorySize.L];
  const isCategoryHowToUse = name === CategoryKey.How_To_Use;
  const isSpecialCategoryBlocked = categoryStore.isSpecialCategoryBlocked;
  const isSpecialCategory = name === CategoryKey.Specials;
  const isAllInOneCategory = name === CategoryKey.All_In_One;

  useEffect(() => {
    if (isSpecialCategory) {
      categoryStore.checkIfSpecialDateAndUpdateSpecialCategory(id);
    }
  }, [id, isSpecialCategory]);

  const handleCategoryPress = () => {
    // Early return if any of the following conditions are true:
    // 1. The action is currently disabled.
    // 2. The category is special and blocked.

    if (isBlocked) {
      onBlockedCategoryPress?.();
      return;
    }

    if (
      isActionDisabled?.current ||
      (isSpecialCategoryBlocked && isSpecialCategory)
    ) {
      return;
    }

    categoryStore.categoryPressHandler({
      categoryId: id,
      key: name,
    });
  };

  if (isLoading) {
    return (
      <Skeleton
        width="100%"
        height={categorySize}
        borderRadius={borderRadius}
      />
    );
  }

  const renderLockedContentParams = {
    isContentLocked,
    isSpecialCategory,
    isSpecialCategoryBlocked,
    categorySize,
    colors,
    size,
  };

  const renderUnlockedContentParams = {
    t,
    colors,
    isContentLocked,
    isSpecialCategory,
    allSessionsCount,
    size,
    isCategoryHowToUse,
  };

  const renderHeaderParams = {
    name: displayName[language],
    size,
    colors,
    isSpecialCategory,
    isBlocked,
    isContentLocked,
  };

  const renderHomePageCategoryParams = {
    name: displayName[language],
    colors,
    t,
    allSessionsCount,
    isContentLocked,
    isBlocked,
    isAllInOneCategory,
  };

  return (
    <Pressable onPress={handleCategoryPress}>
      <View
        style={[
          styles.Category,
          getShadowOpacity(theme, colors.bgColor).shadowOpacity_level_2,
        ]}>
        <FastImage
          resizeMode="cover"
          source={{uri: image}}
          style={[styles.categoryImage, {height: categorySize}, style]}>
          {isHomepage ? (
            <>{renderHomePageCategory(renderHomePageCategoryParams)}</>
          ) : (
            <>
              {renderLockedContent(renderLockedContentParams)}
              {renderUnlockedContent(renderUnlockedContentParams)}
              {renderHeader(renderHeaderParams)}
            </>
          )}
        </FastImage>
      </View>
    </Pressable>
  );
};

const renderHomePageCategory = (params: {
  name: string;
  colors: ColorType;
  allSessionsCount: number;
  t: TFunction;
  isContentLocked: boolean;
  isBlocked: boolean;
  isAllInOneCategory: boolean;
}) => {
  const {
    name,
    colors,
    t,
    allSessionsCount,
    isContentLocked,
    isBlocked,
    isAllInOneCategory,
  } = params;

  if (isAllInOneCategory) {
    return (
      <View style={styles.homePageCategorySection}>
        <Gradient style={styles.explore}>
          <AppText
            weight={'900'}
            style={{color: colors.white}}
            size={TextSize.LEVEL_6}
            text={t('common.explore')}
          />
        </Gradient>
        <AppText
          weight={'900'}
          style={[styles.homePageSessionCount, {color: colors.white}]}
          size={TextSize.LEVEL_8}
          text={name}
        />
      </View>
    );
  }

  return (
    <>
      <View style={styles.homePageCategorySection}>
        <View>
          <View style={styles.homePageSessionCountBlock}>
            {isBlocked && !isContentLocked && (
              <View style={styles.homePageLockIcon}>
                <SvgXml
                  fill={colors.white}
                  xml={LockIconWithoutStyle}
                  width={25}
                  height={25}
                />
              </View>
            )}
            <AppText
              weight="500"
              style={{color: colors.white}}
              size={TextSize.LEVEL_6}
              text={`${allSessionsCount} ${t('sessions.sessions')}`}
            />
          </View>
          <AppText
            weight={'900'}
            style={[styles.homePageSessionCount, {color: colors.white}]}
            size={TextSize.LEVEL_8}
            text={name}
          />
        </View>
      </View>
      <View style={styles.homePagePremiumBlock}>
        {isContentLocked && <PremiumBlock isGradient />}
      </View>
    </>
  );
};

const renderHeader = (params: {
  name: string;
  size: CateorySize;
  colors: ColorType;
  isSpecialCategory: boolean;
  isBlocked: boolean;
  isContentLocked: boolean;
}) => {
  const {name, size, colors, isSpecialCategory, isBlocked, isContentLocked} =
    params;

  return (
    <View style={styles.headerSection}>
      <AppText
        weight={'900'}
        style={[styles.categoryName, {color: colors.white}]}
        size={size === CateorySize.L ? TextSize.LEVEL_7 : TextSize.LEVEL_6}
        text={name}
      />
      {!isSpecialCategory && isBlocked && !isContentLocked && (
        <View
          style={[styles.lockedIconWrapper, {backgroundColor: colors.white}]}>
          <SvgXml
            xml={LockedIcon}
            width={horizontalScale(size === CateorySize.L ? 30 : 22)}
            height={horizontalScale(size === CateorySize.L ? 40 : 22)}
          />
        </View>
      )}
    </View>
  );
};

const renderLockedContent = (params: {
  size: CateorySize;
  colors: ColorType;
  isSpecialCategory: boolean;
  isContentLocked: boolean;
  isSpecialCategoryBlocked: boolean;
  categorySize: number;
}) => {
  const {
    isContentLocked,
    isSpecialCategory,
    isSpecialCategoryBlocked,
    categorySize,
    colors,
  } = params;

  if (isContentLocked && !isSpecialCategory) {
    return (
      <View
        style={[
          styles.lockedLayout,
          {height: categorySize, backgroundColor: colors.bgLayout},
        ]}>
        <View style={styles.premiumBlock}>
          <PremiumBlock />
        </View>
      </View>
    );
  }

  if (isSpecialCategory && isSpecialCategoryBlocked) {
    return (
      <View
        style={[
          styles.lockedLayout,
          {height: categorySize, backgroundColor: colors.bgLayout},
        ]}>
        {isContentLocked && (
          <View style={styles.premiumBlock}>
            <PremiumBlock />
          </View>
        )}
      </View>
    );
  }
};

const renderUnlockedContent = (params: {
  size: CateorySize;
  colors: ColorType;
  isSpecialCategory: boolean;
  isContentLocked: boolean;
  allSessionsCount: number;
  isCategoryHowToUse: boolean;
  t: TFunction;
}) => {
  const {
    isContentLocked,
    isSpecialCategory,
    allSessionsCount,
    t,
    size,
    isCategoryHowToUse,
    colors,
  } = params;

  if (!isContentLocked && !isSpecialCategory) {
    return (
      <View style={[styles.sessionCountBlock, {backgroundColor: colors.white}]}>
        <AppText
          weight="600"
          style={{color: colors.primaryTextColor}}
          size={size === CateorySize.L ? TextSize.LEVEL_6 : TextSize.LEVEL_2}
          text={
            isCategoryHowToUse
              ? t('common.explore_here')
              : `${allSessionsCount} ${t('sessions.sessions')}`
          }
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  Category: {
    borderRadius: borderRadius,
  },
  categoryImage: {
    borderRadius: borderRadius,
    justifyContent: 'flex-end',
    padding: horizontalScale(20),
  },
  lockedLayout: {
    left: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedIconWrapper: {
    padding: horizontalScale(5),
    borderRadius: moderateScale(20),
    position: 'absolute',
    right: horizontalScale(10),
    top: horizontalScale(10),
  },
  sessionCountBlock: {
    alignSelf: 'flex-start',
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(8),
    borderRadius: moderateScale(6),
    position: 'absolute',
    left: horizontalScale(10),
    bottom: horizontalScale(10),
  },
  premiumBlock: {
    position: 'absolute',
    left: horizontalScale(10),
    bottom: horizontalScale(10),
  },
  headerSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: horizontalScale(10),
  },
  categoryName: {
    textTransform: 'capitalize',
    width: '90%',
  },

  homePageCategorySection: {
    position: 'absolute',
    top: horizontalScale(30),
    left: horizontalScale(30),
  },
  homePageSessionCountBlock: {
    alignSelf: 'flex-start',
    paddingVertical: horizontalScale(5),
    borderRadius: moderateScale(15),
    marginBottom: horizontalScale(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  homePageSessionCount: {
    textTransform: 'uppercase',
  },
  homePageLockIcon: {
    marginRight: horizontalScale(10),
  },
  homePagePremiumBlock: {
    transform: [{scale: 1.6}],
    position: 'absolute',
    right: horizontalScale(50),
    top: horizontalScale(40),
  },
  explore: {
    alignSelf: 'flex-start',
    padding: horizontalScale(7),
    paddingHorizontal: horizontalScale(15),
    alignItems: 'center',
    borderRadius: moderateScale(15),
    marginBottom: horizontalScale(10),
  },
});

export default memo(observer(Category));
