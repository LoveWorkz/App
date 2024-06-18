import React, {memo} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';

import {CoreChallengeIntroCard} from '@src/entities/Challenge';
import {verticalScale} from '@src/shared/lib/Metrics';

const CoreChallengeIntroPage = () => {
  return (
    <View style={styles.CoreChallengeIntroPage}>
      <StatusBar barStyle={'light-content'} />
      <CoreChallengeIntroCard />
    </View>
  );
};

export default memo(CoreChallengeIntroPage);

const styles = StyleSheet.create({
  CoreChallengeIntroPage: {
    flex: 1,
    paddingTop: verticalScale(10),
  },
});
