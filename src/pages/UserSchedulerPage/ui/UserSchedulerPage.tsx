import { UserScheduler } from '@src/widgets/UserScheduler';
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

const UserSchedulerPage = () => {
  return (
    <View style={styles.UserSchedulerPage}>
      <UserScheduler />
    </View>
  );
};

export default memo(UserSchedulerPage);

const styles = StyleSheet.create({
  UserSchedulerPage: {
    flex: 1,
  },
});