import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

interface NotificationsPageProps {}

const NotificationsPage = (props: NotificationsPageProps) => {
  const {} = props;

  return (
    <View style={styles.NotificationsPage}>
      <Text>NotificationsPage</Text>
    </View>
  );
};

export default memo(NotificationsPage);

const styles = StyleSheet.create({
  NotificationsPage: {},
});
