import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {ArranKennedy} from '@src/shared/assets/images';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '../AppText/AppText';
import {Avatar} from '../Avatar/Avatar';
import {useTranslation} from 'react-i18next';

export const ArranKennedyBlock = memo(() => {
  const {t} = useTranslation();
  return (
    <View style={styles.ArranKennedyBlock}>
      <View style={styles.avatarWrapper}>
        <Avatar size={60} imageNumber={ArranKennedy} />
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
