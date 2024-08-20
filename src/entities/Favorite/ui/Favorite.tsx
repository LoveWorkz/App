import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
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
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {favoriteImage} from '@src/shared/assets/images';

interface FavouriteProps {
  isLoading: boolean;
  text: string;
}
const height = 90;
const borderRadius = moderateScale(20);

export const Favorite = (props: FavouriteProps) => {
  const {isLoading, text} = props;

  const colors = useColors();
  const {t} = useTranslation();
  const {theme, isDark} = useTheme();

  if (isLoading) {
    return <Skeleton height={height} borderRadius={borderRadius} />;
  }

  return (
    <View
      style={{
        ...getShadowOpacity(theme, colors.bgColor).shadowOpacity_level_1,
        borderRadius,
      }}>
      <FastImage
        style={[
          styles.favoritesFolder,
          {
            width: windowWidthMinusPaddings,
            backgroundColor: isDark ? colors.bgTertiaryColor : colors.white,
          },
        ]}
        resizeMode={'stretch'}
        source={favoriteImage}>
        <Gradient
          style={[styles.titleWrapper, {backgroundColor: colors.white}]}>
          <AppText style={[styles.title, {color: colors.white}]} text={text} />
        </Gradient>
        <View>
          <AppText
            style={[styles.text]}
            weight={'600'}
            size={TextSize.LEVEL_4}
            text={t('favorites.title')}
          />
        </View>
      </FastImage>
    </View>
  );
};

export default memo(Favorite);

const styles = StyleSheet.create({
  favoritesFolder: {
    borderRadius: borderRadius,
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(15),
  },
  titleWrapper: {
    paddingVertical: verticalScale(4),
    paddingHorizontal: verticalScale(10),
    borderRadius: moderateScale(6),
    alignSelf: 'flex-start',
  },
  title: {
    textTransform: 'lowercase',
  },
  text: {
    marginTop: verticalScale(13),
    textTransform: 'capitalize',
  },
});
