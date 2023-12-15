import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

interface AboutMyRelationshipPageProps {}

const AboutMyRelationshipPage = (props: AboutMyRelationshipPageProps) => {
  const {} = props;

  return (
    <View style={styles.AboutMyRelationshipPage}>
      <Text>AboutMyRelationshipPage</Text>
    </View>
  );
};

export default memo(AboutMyRelationshipPage);

const styles = StyleSheet.create({
  AboutMyRelationshipPage: {},
});
