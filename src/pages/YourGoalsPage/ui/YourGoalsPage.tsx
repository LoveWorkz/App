import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {GoalsList} from '@src/entities/Goal';

const YourGoalsPage = () => {
  return (
    <View style={styles.YourGoalsPage}>
      <GoalsList />
    </View>
  );
};

export default memo(YourGoalsPage);

const styles = StyleSheet.create({
  YourGoalsPage: {
    flex: 1,
  },
});
