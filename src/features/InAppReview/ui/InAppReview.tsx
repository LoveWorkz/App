import React, {memo, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import InAppReviewStore from '../model/store/InAppReviewStore';

const InAppReview = () => {
  useEffect(() => {
    InAppReviewStore.rate();
  }, []);

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
