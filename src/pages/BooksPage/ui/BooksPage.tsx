import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

const BooksPage = () => {
  return (
    <View style={styles.container}>
      <Text>Books Page</Text>
    </View>
  );
};

export const ComponentWrapper = memo(BooksPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
