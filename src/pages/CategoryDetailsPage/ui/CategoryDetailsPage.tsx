import React, {memo, useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useHeaderHeight} from '@react-navigation/elements';

import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  getShadowOpacity,
  globalPadding,
  windowHeightMinusPaddings,
} from '@src/app/styles/GlobalStyle';
import {categoryStore, CategoryType} from '@src/entities/Category';
import {useColors} from '@src/app/providers/colorsProvider';
import {useTheme} from '@src/app/providers/themeProvider';
import {isPlatformIos} from '@src/shared/consts/common';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {Carousel} from '@src/shared/ui/Carousel/Carousel';
import CategoryDetailsItem from './CategoryDetailsItem';

interface CategoryDetailsPageProps {
  route?: {
    params: {
      id: string;
    };
  };
}

const CategoryDetailsPage = (props: CategoryDetailsPageProps) => {
  const {route} = props;

  const colors = useColors();
  const {theme} = useTheme();
  const statusBarHeight = getStatusBarHeight();
  const navbarHeaderHeight = useHeaderHeight();
  const language = useLanguage();

  const levelId = route?.params?.id;
  const levels = categoriesStore.categories;
  const [currentLevel, setCurrentLevel] = useState<CategoryType>(levels[0]);

  const navbarHeight = isPlatformIos
    ? navbarHeaderHeight
    : navbarHeaderHeight + statusBarHeight;

  const levelNumber = useMemo(() => {
    if (!levelId) {
      return 0;
    }

    return categoryStore.getLevelIndexById(levels, levelId);
  }, [levels, levelId]);

  const swipeHandler = useCallback((level: CategoryType) => {
    setCurrentLevel(level);
  }, []);

  return (
    <View
      style={[
        styles.CategoryDetails,
        {
          minHeight: windowHeightMinusPaddings - navbarHeight - globalPadding,
          backgroundColor: colors.bgTertiaryColor,
          ...getShadowOpacity(theme).shadowOpacity_level_2,
        },
      ]}>
      <Carousel
        initialIndex={levelNumber}
        onSwipeHandler={swipeHandler}
        itemWidth={horizontalScale(333)}
        setAsWidth={false}
        isBottomPagination
        data={levels}
        Component={CategoryDetailsItem}
        paginationStyle={styles.paginationStyle}
        isSmallDotPagination={false}
        paginationColor={colors.lavenderBlue}
      />
      {currentLevel && (
        <View style={styles.descriptionWrapper}>
          <AppText
            size={TextSize.LEVEL_4}
            text={currentLevel.description[language]}
          />
        </View>
      )}
    </View>
  );
};

export default memo(observer(CategoryDetailsPage));

const styles = StyleSheet.create({
  CategoryDetails: {
    borderRadius: moderateScale(20),
    paddingVertical: horizontalScale(10),
  },
  descriptionWrapper: {
    marginTop: verticalScale(40),
    paddingHorizontal: horizontalScale(10),
  },
  paginationStyle: {
    width: '100%',
    alignItems: 'center',
    top: 20,
  },
});
