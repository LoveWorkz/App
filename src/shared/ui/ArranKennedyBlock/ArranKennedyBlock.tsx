import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {ArranKennedy} from '@src/shared/assets/images';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '../AppText/AppText';
import {Avatar} from '../Avatar/Avatar';
import {useTranslation} from 'react-i18next';
import {Therapist} from '@src/pages/BreakPage/model/store/types';
import firebaseStorage from '@react-native-firebase/storage';

type Props = {
  therapist: Therapist;
};

export const ArranKennedyBlock = memo(({therapist}: Props) => {
  const {t} = useTranslation();
  const [avatarUrl, setAvatarUrl] = React.useState('');

  useEffect(() => {
    const asyncEffect = async () => {
      const url = await firebaseStorage()
        .ref(`therapists_data/${therapist.image_name}`)
        .getDownloadURL();
      setAvatarUrl(url);
    };
    asyncEffect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.ArranKennedyBlock}>
      <View style={styles.avatarWrapper}>
        <Avatar size={60} imageNumber={ArranKennedy} imageUrl={avatarUrl} />
      </View>
      <AppText
        weight="900"
        size={TextSize.LEVEL_5}
        text={t('common.arran_kennedy')}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  ArranKennedyBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    marginRight: horizontalScale(10),
  },
});
