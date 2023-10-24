import React, {memo, useEffect, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useHeaderHeight} from '@react-navigation/elements';

import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {
  getShadowOpacity,
  globalStyles,
  windowHeightMinusPaddings,
} from '@src/app/styles/GlobalStyle';
import {LockIcon} from '@src/shared/assets/icons/Lock';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {categoryStore} from '@src/entities/Category';
import {useColors} from '@src/app/providers/colorsProvider';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {useTheme} from '@src/app/providers/themeProvider';
import {DocumentType} from '@src/shared/types/types';
import {isPlatformIos} from '@src/shared/consts/common';
import categoryDetailsStore from '../model/store/categoryDetailsStore';

interface CategoryDetailsPageProps {
  route?: {params: {id: string}};
}

export const CategoryDetailsPage = (props: CategoryDetailsPageProps) => {
  const {route} = props;
  const {t, i18n} = useTranslation();
  const colors = useColors();
  const {theme} = useTheme();
  const statusBarHeight = getStatusBarHeight();
  const navbarHeaderHeight = useHeaderHeight();

  const navbarHeight = isPlatformIos
    ? navbarHeaderHeight
    : navbarHeaderHeight + statusBarHeight;

  const language = i18n.language as LanguageValueType;
  const category = categoryStore.category;
  const categoryImage = category?.image.large;

  useEffect(() => {
    route?.params.id && categoryDetailsStore.init(route.params.id);
  }, [route?.params.id]);

  const uri = useMemo(() => {
    return {
      uri: categoryImage,
    };
  }, [categoryImage]);

  const onPressHandler = () => {
    if (category?.isBlocked) {
      navigation.navigate(TabRoutesNames.SHOP);
    } else {
      category?.id &&
        navigation.replace(AppRouteNames.SESSIONS, {
          type: DocumentType.CATEGORY,
          title: category.displayName[language],
          id: category.id,
        });
    }
  };

  const dontShowAgainHandler = () => {
    category?.id && categoryDetailsStore.hideCategoryDetails(category.id);
  };

  if (!category) {
    return <></>;
  }

  return (
    <View
      style={[
        styles.CategoryDetailsPage,
        {
          minHeight: windowHeightMinusPaddings - navbarHeight,
        },
      ]}>
      <View
        style={[
          styles.CategoryDetails,
          {
            backgroundColor: colors.bgTertiaryColor,
            ...getShadowOpacity(theme).shadowOpacity_level_2,
          },
        ]}>
        <View>
          {category.isBlocked && (
            <>
              <View
                style={[styles.layout, {backgroundColor: colors.bgLayout}]}
              />
              <View style={[styles.lockIconWrapper]}>
                <SvgXml xml={LockIcon} fill={'white'} style={styles.lockIcon} />
              </View>
            </>
          )}
          <FastImage style={styles.image} source={uri} />
        </View>
        <View>
          <AppText
            style={styles.title}
            weight={'500'}
            size={TextSize.LEVEL_7}
            text={`${category.displayName[language]} package`}
          />
          <AppText size={TextSize.LEVEL_4} text={category.description} />
        </View>
      </View>
      <View style={styles.btnWrapper}>
        <Button
          onPress={onPressHandler}
          style={styles.btn}
          theme={ButtonTheme.GRADIENT}>
          <AppText
            style={{color: colors.bgQuinaryColor}}
            weight={'700'}
            size={TextSize.LEVEL_4}
            text={category.isBlocked ? t('buy_now') : t('start')}
          />
        </Button>
        {!category.isBlocked && (
          <Pressable onPress={dontShowAgainHandler}>
            <AppText
              style={styles.dontShowAgain}
              weight={'600'}
              size={TextSize.LEVEL_4}
              text={t('dont_show_again')}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default memo(observer(CategoryDetailsPage));

const styles = StyleSheet.create({
  CategoryDetailsPage: {
    paddingBottom: verticalScale(180),
  },
  btnWrapper: {
    position: 'absolute',
    bottom: verticalScale(50),
    width: '100%',
  },
  btn: {
    borderRadius: moderateScale(10),
    justifyContent: 'center',
  },
  dontShowAgain: {
    textDecorationLine: 'underline',
    marginTop: verticalScale(5),
    alignSelf: 'center',
  },
  CategoryDetails: {
    minHeight: 525,
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
  },
  image: {
    height: 225,
    borderRadius: moderateScale(20),
  },
  title: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },

  layout: {
    position: 'absolute',
    width: '100%',
    borderRadius: moderateScale(20),
    height: '100%',
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
  lockIcon: {
    height: verticalScale(46),
    width: horizontalScale(36),
  },
});
