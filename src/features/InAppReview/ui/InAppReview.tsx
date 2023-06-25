import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

interface InAppReviewProps {}

const InAppReview = (props: InAppReviewProps) => {
  const {} = props;

  return (
    <View style={styles.InAppReview}>
      <Text>InAppReview</Text>
    </View>
  );
};

export default memo(InAppReview);

const styles = StyleSheet.create({
  InAppReview: {},
});
