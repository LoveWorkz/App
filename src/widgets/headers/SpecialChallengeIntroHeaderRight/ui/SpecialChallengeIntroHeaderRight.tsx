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
import {ShareIcon} from '@src/shared/assets/icons/Share';

const SpecialChallengeIntroHeaderRight = () => {
  const colors = useColors();

  const specialChallenge = challengeStore.specialChallenge;
  const isFavorite = favoriteStore.isFavorite;

  useEffect(() => {
    if (!specialChallenge) {
      return;
    }

    favoriteStore.setIsFavorite({
      id: specialChallenge.id,
      favoriteKey: 'specialChallenge',
    });
  }, [specialChallenge]);

  const toggleFavorite = () => {
    const id = specialChallenge?.id;
    id && favoriteStore.toggleFavorite(id, 'specialChallenge');
  };

  return (
    <View style={styles.SpecialChallengeIntroHeaderRight}>
      <Button>
        <SvgXml
          xml={ShareIcon}
          stroke={colors.white}
          style={styles.shareIcon}
        />
      </Button>
      <Button style={styles.HeartIconBtn} onPress={toggleFavorite}>
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
            stroke={colors.white}
            style={styles.HeartIcon}
          />
        )}
      </Button>
    </View>
  );
};

export default memo(observer(SpecialChallengeIntroHeaderRight));

const styles = StyleSheet.create({
  SpecialChallengeIntroHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  HeartIconBtn: {
    marginLeft: horizontalScale(10),
  },
  HeartIcon: {
    height: verticalScale(18),
    width: horizontalScale(20),
  },

  shareIcon: {
    height: verticalScale(15),
    width: horizontalScale(20),
    marginRight: horizontalScale(10),
  },
});
