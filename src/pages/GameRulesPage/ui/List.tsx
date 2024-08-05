import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {verticalScale} from '@src/shared/lib/Metrics';
import {TextListItem} from '@src/shared/ui/TextListItem/TextListItem';
import {useTranslation} from 'react-i18next';

const List = () => {
  const {t} = useTranslation();
  return (
    <View style={styles.List}>
      <View style={styles.listItem}>
        <TextListItem text={t('game_rules.rule_1')} />
      </View>
      <View style={styles.listItem}>
        <TextListItem text={t('game_rules.rule_2')} />
      </View>
      <TextListItem text={t('game_rules.rule_3')} />
    </View>
  );
};

export default memo(List);

const styles = StyleSheet.create({
  List: {
    width: '95%',
  },
  listItem: {
    marginBottom: verticalScale(25),
  },
});
