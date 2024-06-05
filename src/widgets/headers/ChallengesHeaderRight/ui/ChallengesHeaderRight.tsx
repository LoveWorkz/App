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
import InformationBlock from '@src/shared/ui/InformationBlock/InformationBlock';
import {InformationBlockPopup} from '@src/shared/ui/InformationBlock/InformationBlockPopup';
import {infoTextType} from '@src/widgets/InformationBlock';
import {ShareIcon} from '@src/shared/assets/icons/Share';
import {shareStore} from '@src/features/Share';
import {Spinner} from '@src/shared/ui/Spinner/Spinner';

const textContent: infoTextType[] = [];

const ChallengesHeaderRight = () => {
  const colors = useColors();

  const coreChallenge = challengeStore.coreChallenge;
  const isFavorite = favoriteStore.isFavorite;
  const isUploadingImageToStorage = shareStore.isUploadingImageToStorage;

  useEffect(() => {
    if (!coreChallenge) {
      return;
    }

    favoriteStore.setIsFavorite({
      id: coreChallenge.id,
      favoriteKey: 'coreChallenge',
    });
  }, [coreChallenge]);

  const toggleFavorite = () => {
    const id = coreChallenge?.id;
    id && favoriteStore.toggleFavorite(id, 'coreChallenge');
  };

  const onShareHandler = async () => {
    shareStore.shareCoreChallenge();
  };

  return (
    <View style={styles.ChallengesHeaderRight}>
      <InformationBlock
        popupWidth={horizontalScale(280)}
        isChallenge
        text={textContent}
        title={'Title'}
        Popup={InformationBlockPopup}
      />
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
      <Button onPress={onShareHandler}>
        <SvgXml
          xml={ShareIcon}
          stroke={colors.white}
          style={styles.shareIcon}
        />
      </Button>
      <Spinner visible={isUploadingImageToStorage} />
    </View>
  );
};

export default memo(observer(ChallengesHeaderRight));

const styles = StyleSheet.create({
  ChallengesHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  HeartIconBtn: {
    marginRight: horizontalScale(15),
    marginLeft: horizontalScale(8),
  },
  HeartIcon: {
    height: verticalScale(18),
    width: horizontalScale(20),
  },
  shareIcon: {
    height: verticalScale(15),
    width: horizontalScale(20),
  },
});
