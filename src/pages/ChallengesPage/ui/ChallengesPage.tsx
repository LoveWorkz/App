import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

const ChallengesPage = () => {
  return (
    <View style={styles.container}>
      <Text>Challenges Page</Text>
    </View>
  );
};

export const ComponentWrapper = memo(ChallengesPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
