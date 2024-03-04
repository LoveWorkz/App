import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
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
import {categoryStore} from '@src/entities/Category';
import {useColors} from '@src/app/providers/colorsProvider';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {useTheme} from '@src/app/providers/themeProvider';
import {LockedIcon} from '@src/shared/assets/icons/Locked';
import {isPlatformIos} from '@src/shared/consts/common';
import {WithInAppPurchase} from '@src/widgets/WithInAppPurchase';
import {LockedPopup} from '@src/widgets/LockedPopup';
import categoryDetailsStore from '../model/store/categoryDetailsStore';
import {getCategoryDetailsLockedPopupContent} from '../model/lib/categoryDetailsLib';

export const CategoryDetailsPage = () => {
  const {t, i18n} = useTranslation();
  const colors = useColors();
  const {theme} = useTheme();
  const statusBarHeight = getStatusBarHeight();
  const navbarHeaderHeight = useHeaderHeight();
  const isLockedPopupVisible = categoryDetailsStore.isLockedPopupVisible;
  const setIsLockedPopupVisible = categoryDetailsStore.setIsLockedPopupVisible;

  const categoryDetailsLockedPopupContent =
    getCategoryDetailsLockedPopupContent(t);

  const navbarHeight = isPlatformIos
    ? navbarHeaderHeight
    : navbarHeaderHeight + statusBarHeight;

  const language = i18n.language as LanguageValueType;
  const category = categoryStore.category;
  const categoryImage = category?.image.large;

  const uri = useMemo(() => {
    return {
      uri: categoryImage,
    };
  }, [categoryImage]);

  if (!category) {
    return <></>;
  }

  const isContentLocked = categoryStore.checkContentLock(category.name);

  const onPressHandler = () => {
    categoryDetailsStore.onStartPressHandler({
      language,
      isContentLocked,
    });
  };

  const dontShowAgainHandler = () => {
    category?.id &&
      categoryDetailsStore.hideCategoryDetails({
        id: category.id,
        title: category.displayName[language],
      });
  };

  return (
    <WithInAppPurchase>
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
            {isContentLocked && (
              <>
                <View
                  style={[styles.layout, {backgroundColor: colors.bgLayout}]}
                />
                <View style={[styles.lockIconWrapper]}>
                  <SvgXml
                    xml={LockIcon}
                    fill={'white'}
                    style={styles.lockIcon}
                  />
                </View>
              </>
            )}
            <FastImage style={styles.image} source={uri}>
              {category.isBlocked && (
                <SvgXml xml={LockedIcon} style={[styles.lockedIcon]} />
              )}
            </FastImage>
          </View>
          <View>
            <AppText
              style={styles.title}
              weight={'500'}
              size={TextSize.LEVEL_7}
              text={`${category.displayName[language]} package`}
            />
            <AppText
              size={TextSize.LEVEL_4}
              text={category.description[language]}
            />
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
              text={isContentLocked ? t('buy_now') : t('start')}
            />
          </Button>
          {!category.isBlocked && !isContentLocked && (
            <Button onPress={dontShowAgainHandler}>
              <AppText
                style={styles.dontShowAgain}
                weight={'600'}
                size={TextSize.LEVEL_4}
                text={t('dont_show_again')}
              />
            </Button>
          )}
          <LockedPopup
            title={categoryDetailsLockedPopupContent.title}
            text={categoryDetailsLockedPopupContent.text}
            visible={isLockedPopupVisible}
            setVisible={setIsLockedPopupVisible}
          />
        </View>
      </View>
    </WithInAppPurchase>
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
  lockedIcon: {
    height: verticalScale(32),
    width: horizontalScale(27),
    position: 'absolute',
    right: 10,
    top: 10,
  },
});
