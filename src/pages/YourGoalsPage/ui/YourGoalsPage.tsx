import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

interface YourGoalsPageProps {}

const YourGoalsPage = (props: YourGoalsPageProps) => {
  const {} = props;

  return (
    <View style={styles.YourGoalsPage}>
      <Text>YourGoalsPage</Text>
    </View>
  );
};

export default memo(YourGoalsPage);

const styles = StyleSheet.create({
  YourGoalsPage: {},
});
