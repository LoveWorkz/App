import React, {memo} from 'react';
import {ImageBackground, Pressable, StyleSheet, View} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {windowWidthMinusPaddings} from '@src/app/styles/GlobalStyle';
import {Gradient, GradientSize} from '@src/shared/ui/Gradient/Gradient';
import {verticalScale} from '@src/shared/lib/Metrics';

export const Favourites = () => {
  const colors = useColors();

  const onPressHandler = () => {};

  return (
    <Pressable onPress={onPressHandler}>
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
          <AppText style={styles.title} text={'16 quetions'} />
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
    </Pressable>
  );
};

export default memo(Favourites);

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
