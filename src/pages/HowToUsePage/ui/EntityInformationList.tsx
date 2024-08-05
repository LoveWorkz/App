import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';

import {verticalScale} from '@src/shared/lib/Metrics';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {TextListItem} from '@src/shared/ui/TextListItem/TextListItem';
import {upperFirst} from 'lodash';
import {useTranslation} from 'react-i18next';

const EntityInformationList = () => {
  const onLevelPressHandler = useCallback(() => {
    navigation.navigate(AppRouteNames.CATEGORY_DETAILS);
  }, []);

  const onQuadrantPressHandler = useCallback(() => {
    navigation.navigate(AppRouteNames.QUADRANT_DETAILS);
  }, []);

  const {t} = useTranslation();

  return (
    <View style={styles.List}>
      <View style={styles.listItem}>
        <TextListItem
          hideButton={false}
          onPress={onLevelPressHandler}
          prefix={`${upperFirst(t('common.levels'))}:`}
          text={t('common.these_represents_stages_of_journey')}
        />
      </View>
      <View style={styles.listItem}>
        <TextListItem
          hideButton={false}
          onPress={onQuadrantPressHandler}
          prefix={`${upperFirst(t('common.quadrants'))}:`}
          text={t('common.with_each_level_text')}
        />
      </View>
      <TextListItem
        prefix={`${upperFirst(t('sessions.sessions'))}:`}
        text={t('common.every_quadrant_consists')}
      />
    </View>
  );
};

export default memo(EntityInformationList);

const styles = StyleSheet.create({
  List: {
    width: '95%',
  },
  listItem: {
    marginBottom: verticalScale(25),
  },
});
