import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Gradient, GradientSize} from '@src/shared/ui/Gradient/Gradient';
import {useColors} from '@src/app/providers/colorsProvider';
import {DisplayText, StyleType} from '@src/shared/types/types';
import {
  categoryLayoutIconZIndex,
  categoryLayoutZIndex,
  globalStyles,
} from '@src/app/styles/GlobalStyle';
import {LockIcon} from '@src/shared/assets/icons/Lock';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {CateorySize} from '../model/types/categoryTypes';

interface CategoryProps {
  style?: StyleType;
  questions: string[];
  name: string;
  image: string;
  size?: CateorySize;
  isBlocked: boolean;
  id: string;
  isCategoryDetailsVisible: boolean;
  displayName: DisplayText;
}

const Category = (props: CategoryProps) => {
  const {
    questions,
    image,
    size = CateorySize.L,
    isBlocked = false,
    id,
    isCategoryDetailsVisible,
    style,
    displayName,
  } = props;
  const colors = useColors();
  const {t, i18n} = useTranslation();
  const language = i18n.language as LanguageValueType;

  const isSizeL = size === CateorySize.L;

  const onCategoryPressHandler = () => {
    if (isCategoryDetailsVisible) {
      navigation.navigate(AppRouteNames.CATEGORY_DETAILS, {
        title: displayName[language],
        id,
      });
    } else {
      navigation.navigate(AppRouteNames.QUESTIONS, {type: 'category', id});
    }
  };

  return (
    <Pressable onPress={onCategoryPressHandler}>
      {isBlocked && (
        <>
          <View
            style={[
              styles.layout,
              styles[size],
              {
                zIndex: categoryLayoutZIndex,
                backgroundColor: colors.black,
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
              fill={colors.white}
              style={styles.lockIcon}
            />
          </View>
        </>
      )}
      <View style={{...globalStyles.shadowOpacity}}>
        <FastImage
          resizeMode="cover"
          style={[
            styles.category,
            styles[size],
            style,
            {padding: isSizeL ? 20 : 10},
          ]}
          source={{
            uri: image,
          }}>
          <Gradient size={GradientSize.SMALL}>
            <AppText
              style={{color: colors.white}}
              weight={'500'}
              size={isSizeL ? TextSize.LEVEL_6 : TextSize.LEVEL_3}
              text={`${questions.length} ${t('questions.questions')}`}
            />
          </Gradient>
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
    borderRadius: 20,
    borderColor: 'silver',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  image: {
    borderRadius: 20,
    aspectRatio: 1 / 2,
  },
  status: {
    marginTop: 8,
    textTransform: 'uppercase',
  },
  layout: {
    position: 'absolute',
    opacity: 0.4,
    width: '100%',
    borderRadius: 20,
  },
  lockIconWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  lockIcon: {
    height: 35,
    width: 27,
  },

  size_m: {
    height: 120,
  },
  size_l: {
    height: 210,
  },
  size_xl: {
    height: 200,
  },
});
