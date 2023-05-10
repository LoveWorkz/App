import React, {memo, useEffect, useMemo} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {
  categoryLayoutIconZIndex,
  categoryLayoutZIndex,
  globalStyles,
} from '@src/app/styles/GlobalStyle';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {LockIcon} from '@src/shared/assets/icons/Lock';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {categoryStore} from '@src/entities/Category';
import {useColors} from '@src/app/providers/colorsProvider';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {LoaderWrapper} from '@src/shared/ui/LoaderWrapper/LoaderWrapper';
import categoryDetailsStore from '../model/store/categoryDetailsStore';

interface CategoryDetailsPageProps {
  route?: {params: {id: string}};
}

export const CategoryDetailsPage = (props: CategoryDetailsPageProps) => {
  const {route} = props;
  const {t, i18n} = useTranslation();
  const colors = useColors();
  const language = i18n.language as LanguageValueType;
  const category = categoryStore.category;

  useEffect(() => {
    route?.params.id && categoryStore.fetchCategory({id: route.params.id});
  }, [route?.params.id]);

  const uri = useMemo(() => {
    return {
      uri: category?.image.large,
    };
  }, [category?.image.large]);

  const onPressHandler = () => {
    if (category?.isBlocked) {
      navigation.navigate(TabRoutesNames.SHOP);
    } else {
      category?.id &&
        navigation.replace(AppRouteNames.QUESTIONS, {
          type: 'category',
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
    <LoaderWrapper isLoading={categoryStore.isCategoryDetailsPageLoading}>
      <View style={styles.CategoryDetailsPage}>
        <View
          style={[
            styles.CategoryDetails,
            {backgroundColor: colors.bgTertiaryColor},
          ]}>
          <View>
            {category.isBlocked && (
              <>
                <View
                  style={[
                    styles.layout,
                    {
                      zIndex: categoryLayoutZIndex,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.lockIconWrapper,
                    {zIndex: categoryLayoutIconZIndex},
                  ]}>
                  <SvgXml
                    xml={LockIcon}
                    fill={'white'}
                    style={styles.lockIcon}
                  />
                </View>
              </>
            )}
            <Image style={styles.image} source={uri} />
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
        <Gradient style={styles.btn}>
          <Button onPress={onPressHandler} theme={ButtonTheme.CLEAR}>
            <AppText
              style={styles.btnText}
              weight={'700'}
              size={TextSize.LEVEL_4}
              text={category.isBlocked ? t('buy_now') : 'Start'}
            />
          </Button>
        </Gradient>
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
    </LoaderWrapper>
  );
};

export default memo(observer(CategoryDetailsPage));

const styles = StyleSheet.create({
  CategoryDetailsPage: {
    flex: 1,
  },
  btn: {
    marginTop: verticalScale(75),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    paddingVertical: verticalScale(5),
  },
  btnText: {
    color: 'white',
  },
  dontShowAgain: {
    textDecorationLine: 'underline',
    marginTop: verticalScale(10),
    alignSelf: 'center',
  },
  CategoryDetails: {
    height: verticalScale(525),
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    ...globalStyles.shadowOpacity,
  },
  image: {
    height: verticalScale(225),
    borderRadius: moderateScale(20),
  },
  title: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },

  layout: {
    backgroundColor: 'black',
    position: 'absolute',
    opacity: 0.4,
    width: '100%',
    borderRadius: moderateScale(20),
    height: '100%',
  },
  lockIconWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  lockIcon: {
    height: verticalScale(46),
    width: horizontalScale(36),
  },
});
