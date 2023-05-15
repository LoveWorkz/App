import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Gradient, GradientSize} from '@src/shared/ui/Gradient/Gradient';
import {favorites} from '@src/shared/assets/images';
import {verticalScale} from '@src/shared/lib/Metrics';
import {
  getShadowOpacity,
  windowWidthMinusPaddings,
} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import favoriteStore from '../model/store/favoriteStore';

export const Favorite = () => {
  const colors = useColors();
  const {t} = useTranslation();
  const {theme} = useTheme();

  const favorite = favoriteStore.favorite;

  if (!favorite) {
    return null;
  }

  return (
    <View style={{...getShadowOpacity(theme).shadowOpacity_level_2}}>
      <View>
        <AppText
          style={{color: colors.primaryTextColor}}
          weight={'500'}
          size={TextSize.LEVEL_5}
          text={t('categories.favourites')}
        />
      </View>
      <FastImage
        style={[styles.favoritesFolder, {width: windowWidthMinusPaddings}]}
        resizeMode={'stretch'}
        source={favorites}>
        <Gradient style={styles.titleWrapper} size={GradientSize.SMALL}>
          <AppText
            style={{color: colors.white}}
            text={`${favorite.questions.length} ${t('questions.questions')}`}
          />
        </Gradient>
        <View>
          <AppText
            style={[styles.text, {color: colors.categoryAndFavoritesTextColor}]}
            weight={'700'}
            size={TextSize.LEVEL_4}
            text={t('questions.my_questions')}
          />
        </View>
      </FastImage>
    </View>
  );
};

export default memo(observer(Favorite));

const styles = StyleSheet.create({
  favoritesFolder: {
    marginTop: 20,
    height: 100,
    borderRadius: 20,
    padding: 20,
  },
  titleWrapper: {
    paddingVertical: verticalScale(4),
  },
  text: {
    marginTop: 13,
    textTransform: 'uppercase',
  },
});
