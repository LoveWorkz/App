import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

const SettingsPage = () => {
  return (
    <View style={styles.settings}>
      <Text>Settings Page</Text>
    </View>
  );
};

export const ComponentWrapper = memo(SettingsPage);

const styles = StyleSheet.create({
  settings: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
