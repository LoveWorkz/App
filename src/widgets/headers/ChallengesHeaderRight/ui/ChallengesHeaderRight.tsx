import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {observer} from 'mobx-react-lite';

import {useColors} from '@src/app/providers/colorsProvider';
import {HeartIconWithoutColor} from '@src/shared/assets/icons/Heart';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {favoriteStore} from '@src/entities/Favorite';
import {Button} from '@src/shared/ui/Button/Button';
import {challengeStore} from '@src/entities/Challenge';

export const ChallengesHeaderRight = () => {
  const colors = useColors();

  const coreChallenge = challengeStore.coreChallenge;
  const isFavorite = favoriteStore.isFavorite;

  useEffect(() => {
    if (!coreChallenge) {
      return;
    }

    favoriteStore.setIsFavorite(coreChallenge.id);
  }, [coreChallenge]);

  const toggleFavorite = () => {
    const id = coreChallenge?.id;
    id && favoriteStore.toggleFavorite(id, 'challenge');
  };

  return (
    <View style={styles.ChallengesHeaderRight}>
      <Button onPress={toggleFavorite}>
        {isFavorite ? (
          <SvgXml
            xml={HeartIconWithoutColor}
            stroke={'red'}
            style={styles.HeartIcon}
            fill={'red'}
          />
        ) : (
          <SvgXml
            xml={HeartIconWithoutColor}
            stroke={colors.primaryTextColor}
            style={styles.HeartIcon}
          />
        )}
      </Button>
    </View>
  );
};

export default memo(observer(ChallengesHeaderRight));

const styles = StyleSheet.create({
  ChallengesHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  HeartIcon: {
    height: verticalScale(18),
    width: horizontalScale(20),
  },
});
