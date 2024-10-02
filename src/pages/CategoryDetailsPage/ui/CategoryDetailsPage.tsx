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
import {CategoryDescriptionType} from '@src/entities/Category/model/types/categoryTypes';

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

  function renderParagraph(item: CategoryDescriptionType): React.JSX.Element {
    if (typeof item.content === 'string') {
      return (
        <AppText
          size={TextSize.LEVEL_4}
          style={{marginBottom: verticalScale(10)}}
          text={item.content}
        />
      );
    }
    return (
      <>
        {item.content.map((listItem, index) => (
          <AppText
            key={index}
            size={TextSize.LEVEL_4}
            style={
              index === item.content.length - 1
                ? {marginBottom: verticalScale(10)}
                : {}
            }
            text={`- ${listItem}`}
          />
        ))}
      </>
    ) as React.JSX.Element;
  }

  return (
    <View
      style={[
        styles.CategoryDetails,
        {
          minHeight: windowHeightMinusPaddings - navbarHeight - globalPadding,
          ...getShadowOpacity(theme, colors.bgTertiaryColor)
            .shadowOpacity_level_2,
          backgroundColor: colors.bgTertiaryColor,
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
          {currentLevel.description[language].map(item =>
            renderParagraph(item),
          )}
        </View>
      )}
    </View>
  );
};

export default memo(observer(CategoryDetailsPage));

const styles = StyleSheet.create({
  CategoryDetails: {
    borderRadius: moderateScale(10),
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
