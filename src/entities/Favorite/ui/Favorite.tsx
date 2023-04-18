import React, {memo} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Gradient, GradientSize} from '@src/shared/ui/Gradient/Gradient';
import {verticalScale} from '@src/shared/lib/Metrics';
import {windowWidthMinusPaddings} from '@src/app/styles/GlobalStyle';
import favoriteStore from '../model/store/favoriteStore';

export const Favorite = () => {
  const colors = useColors();
  const favorite = favoriteStore.favorite;

  if (!favorite) {
    return null;
  }

  return (
    <View>
      <View>
        <AppText
          style={{color: colors.primaryTextColor}}
          weight={'500'}
          size={TextSize.LEVEL_5}
          text={'Favourites'}
        />
      </View>
      <ImageBackground
        style={[styles.favoritesFolder, {width: windowWidthMinusPaddings}]}
        imageStyle={styles.imageStyle}
        resizeMode={'stretch'}
        source={{
          uri: 'http://localhost:8081/src/shared/assets/images/favorites.png',
        }}>
        <Gradient style={styles.titleWrapper} size={GradientSize.SMALL}>
          <AppText
            style={styles.title}
            text={`${favorite.questions.length} quetions`}
          />
        </Gradient>
        <View>
          <AppText
            style={[styles.text, {color: colors.primaryTextColor}]}
            weight={'700'}
            size={TextSize.LEVEL_4}
            text={'My questions'}
          />
        </View>
      </ImageBackground>
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
  title: {
    color: 'white',
  },
  text: {
    marginTop: 13,
    textTransform: 'uppercase',
  },
  imageStyle: {
    borderRadius: 20,
    aspectRatio: 1 / 2,
  },
});
