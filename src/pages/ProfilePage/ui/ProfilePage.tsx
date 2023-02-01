import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

const ProfilePage = () => {
  return (
    <View style={styles.profile}>
      <Text>Profile Page</Text>
    </View>
  );
};

export const ComponentWrapper = memo(ProfilePage);

const styles = StyleSheet.create({
  profile: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
