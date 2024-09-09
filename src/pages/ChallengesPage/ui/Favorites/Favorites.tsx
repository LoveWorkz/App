import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Favorite, FavoriteType} from '@src/entities/Favorite';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {verticalScale} from '@src/shared/lib/Metrics';

interface FavoritesProps {
  favorites: FavoriteType | null;
  isLoading: boolean;
}

const Favorites = (props: FavoritesProps) => {
  const {favorites, isLoading} = props;

  const {t} = useTranslation();

  if (isLoading) {
    return (
      <View style={styles.favorites}>
        <Favorite text={''} isLoading={true} />
      </View>
    );
  }

  const onPressHandler = () => {
    console.log('Got to favorites');
    navigation.navigate(AppRouteNames.FAVORITES_CHALLENGES);
  };

  if (!favorites?.ids.length) {
    return null;
  }

  return (
    <Pressable onPress={onPressHandler}>
      <View style={styles.favorites}>
        <Favorite
          text={`${favorites.ids.length} ${t('challenge.title')}`}
          isLoading={isLoading}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  favorites: {
    marginBottom: verticalScale(15),
  },
});

export default memo(Favorites);
