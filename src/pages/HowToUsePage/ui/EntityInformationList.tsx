import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';

import {verticalScale} from '@src/shared/lib/Metrics';
import ListItem from './Helpers/ListItem';

const EntityInformationList = () => {
  const onLevelPressHandler = useCallback(() => {
    // navigation.navigate()
  }, []);

  const onQuadrantPressHandler = useCallback(() => {
    // navigation.navigate()
  }, []);

  return (
    <View style={styles.List}>
      <View style={styles.listItem}>
        <ListItem
          onPress={onLevelPressHandler}
          prefix={'Levels:'}
          text={
            'These represent the stages of your journey, with each level building on the last to introduce more complex concepts and discussions as your relationship matures.'
          }
        />
      </View>
      <View style={styles.listItem}>
        <ListItem
          onPress={onQuadrantPressHandler}
          prefix={'Quadrants:'}
          text={
            'Within each level, the journey is segmented into four key quadrants - Personal Growth, Friendship, Communication & Conflict, and Dreams. These quadrants are the pillars that support a healthy, thriving relationship, addressing the essential areas for development and understanding.'
          }
        />
      </View>
      <ListItem
        hideButton
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
