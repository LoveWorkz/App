import React, {memo} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';

import {ChallengeIntroCard} from '@src/entities/Challenge';

const SpecialChallengeIntroPage = () => {
  return (
    <View style={styles.SpecialChallengeIntroPage}>
      <StatusBar barStyle={'light-content'} />
      <ChallengeIntroCard />
    </View>
  );
};

export default memo(SpecialChallengeIntroPage);

const styles = StyleSheet.create({
  SpecialChallengeIntroPage: {
    flex: 1,
  },
});
