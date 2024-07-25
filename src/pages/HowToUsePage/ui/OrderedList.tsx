import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {TextListItem} from '@src/shared/ui/TextListItem/TextListItem';
import {useTranslation} from 'react-i18next';

const OrderedList = () => {
  const {t} = useTranslation();
  return (
    <>
      <View style={styles.item}>
        <AppText
          size={TextSize.SIZE_24}
          weight="700"
          text={t('common.how_to_navigate')}
        />
      </View>
      <View style={styles.List}>
        <View style={styles.item}>
          <TextListItem
            number={1}
            prefix={t('common.start_the_journey_prefix')}
            text={t('common.begin_love_journey')}
          />
        </View>
        <View style={styles.item}>
          <TextListItem
            number={2}
            prefix={t('common.engage_with_challenges')}
            text={t('common.utilize_the_challenges')}
          />
        </View>
        <View style={styles.item}>
          <TextListItem
            number={3}
            prefix={t('common.explore_independently')}
            text={t('common.venture_beyond_the_journey')}
          />
        </View>
        <TextListItem
          number={4}
          prefix={t('common.maintain_positive_outlook')}
          text={t('common.keep_the_journey')}
        />
      </View>
    </>
  );
};

export default memo(OrderedList);

const styles = StyleSheet.create({
  List: {
    width: '90%',
  },
  item: {
    marginBottom: verticalScale(25),
  },
});
