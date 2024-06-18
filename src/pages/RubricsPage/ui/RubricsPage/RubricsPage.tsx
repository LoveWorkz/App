import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {RubricList} from '@src/entities/Rubric';
import {favoriteStore} from '@src/entities/Favorite';
import {Favourites} from '@src/widgets/Favourites';
import {verticalScale} from '@src/shared/lib/Metrics';
import rubricsPageStore from '../../model/Store/RubricsPageStore';

export const RubricsPage = () => {
  const isLoading = rubricsPageStore.isRubricsPageLoading;
  const favorites = favoriteStore.questionFavorites;

  useFocusEffect(
    useCallback(() => {
      rubricsPageStore.init();
    }, []),
  );

  return (
    <View style={styles.RubricsPage}>
      {!!(favorites && favorites.ids.length) && (
        <View style={styles.favouritesWrapper}>
          <Favourites isLoading={isLoading} />
        </View>
      )}
      <RubricList isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  RubricsPage: {
    flex: 1,
  },
  favouritesWrapper: {
    marginBottom: verticalScale(10),
  },
});

export default memo(observer(RubricsPage));
