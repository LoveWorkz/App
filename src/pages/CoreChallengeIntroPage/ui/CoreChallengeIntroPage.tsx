import React, {memo} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';

import {CoreChallengeIntroCard} from '@src/entities/Challenge';
import {verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';

const CoreChallengeIntroPage = () => {
  const colors = useColors();
  return (
    <View style={styles.CoreChallengeIntroPage}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={colors.backgroundSecondary}
      />
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
