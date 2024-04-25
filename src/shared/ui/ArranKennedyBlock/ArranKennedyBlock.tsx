import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {ArranKennedy} from '@src/shared/assets/images';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '../AppText/AppText';
import {Avatar} from '../Avatar/Avatar';

export const ArranKennedyBlock = memo(() => {
  return (
    <View style={styles.ArranKennedyBlock}>
      <View style={styles.avatarWrapper}>
        <Avatar size={60} imageNumber={ArranKennedy} />
      </View>
      <AppText weight="900" size={TextSize.LEVEL_5} text={'Arran Kennedy'} />
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
