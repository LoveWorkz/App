import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';

import {verticalScale} from '@src/shared/lib/Metrics';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {TextListItem} from '@src/shared/ui/TextListItem/TextListItem';

const EntityInformationList = () => {
  const onLevelPressHandler = useCallback(() => {
    navigation.navigate(AppRouteNames.CATEGORY_DETAILS);
  }, []);

  const onQuadrantPressHandler = useCallback(() => {
    navigation.navigate(AppRouteNames.QUADRANT_DETAILS);
  }, []);

  return (
    <View style={styles.List}>
      <View style={styles.listItem}>
        <TextListItem
          hideButton={false}
          onPress={onLevelPressHandler}
          prefix={'Levels:'}
          text={
            'These represent the stages of your journey, with each level building on the last to introduce more complex concepts and discussions as your relationship matures.'
          }
        />
      </View>
      <View style={styles.listItem}>
        <TextListItem
          hideButton={false}
          onPress={onQuadrantPressHandler}
          prefix={'Quadrants:'}
          text={
            'Within each level, the journey is segmented into four key quadrants - Personal Growth, Friendship, Communication & Conflict, and Dreams. These quadrants are the pillars that support a healthy, thriving relationship, addressing the essential areas for development and understanding.'
          }
        />
      </View>
      <TextListItem
        prefix={'Sessions:'}
        text={
          'Every quadrant consists of 4- 5 sessions, each containing 14 carefully selected questions from over 35 relevant topics, ensuring a comprehensive exploration of each area. The sessions are designed to progressively tackle important relationship themes, facilitating deep discussions and reflections.'
        }
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
