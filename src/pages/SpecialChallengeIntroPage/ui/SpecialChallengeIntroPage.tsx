import React, {memo} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';

import {ChallengeIntroCard} from '@src/entities/Challenge';
import {useColors} from '@src/app/providers/colorsProvider';

const SpecialChallengeIntroPage = () => {
  const colors = useColors();
  return (
    <View style={styles.SpecialChallengeIntroPage}>
      <StatusBar
        barStyle={'light-content'}
        translucent={false}
        backgroundColor={colors.themeSecondaryBackground}
      />
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
