import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {favorites} from '@src/shared/assets/images';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {
  getShadowOpacity,
  windowWidthMinusPaddings,
} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import favoriteStore from '../model/store/favoriteStore';

interface FavouriteProps {
  isLoading: boolean;
}

const height = 90;
const borderRadius = moderateScale(20);

export const Favorite = (props: FavouriteProps) => {
  const {isLoading} = props;

  const colors = useColors();
  const {t} = useTranslation();
  const {theme} = useTheme();

  const favorite = favoriteStore.favorites;
  if (!favorite) {
    return null;
  }

  if (isLoading) {
    return <Skeleton height={height} borderRadius={borderRadius} />;
  }

  return (
    <View style={{...getShadowOpacity(theme).shadowOpacity_level_2}}>
      <FastImage
        style={[styles.favoritesFolder, {width: windowWidthMinusPaddings}]}
        resizeMode={'stretch'}
        source={favorites}>
        <View style={[styles.titleWrapper, {backgroundColor: colors.white}]}>
          <AppText
            style={[styles.title, {color: colors.primaryTextColor}]}
            text={`${favorite.questions.length} ${t('questions.questions')}`}
          />
        </View>
        <View>
          <AppText
            style={[styles.text, {color: colors.white}]}
            weight={'700'}
            size={TextSize.LEVEL_4}
            text={t('favorites.title')}
          />
        </View>
      </FastImage>
    </View>
  );
};

export default memo(observer(Favorite));

const styles = StyleSheet.create({
  favoritesFolder: {
    borderRadius: borderRadius,
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(15),
  },
  titleWrapper: {
    paddingVertical: verticalScale(4),
    paddingHorizontal: verticalScale(10),
    borderRadius: moderateScale(8),
    alignSelf: 'flex-start',
  },
  title: {
    textTransform: 'capitalize',
  },
  text: {
    marginTop: verticalScale(13),
    textTransform: 'capitalize',
  },
});
