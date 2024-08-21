import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {ChallengeGroupDetails} from '@src/entities/ChallengeGroup';

const ChallengeTypeInfoPage = () => {
  //TODO: // translations-fix // add translations //translations-todo
  const title = 'It’s time for a Routine!';
  const description =
    'Implementing new routines in your lives fosters a “we” feeling.  They provide structured moments for sharing thoughts, feelings, and daily experiences, ultimately strengthening your bond and ensuring your relationship continues to grow and thrive.';

  return (
    <View style={styles.ChallengeTypeInfoPage}>
      <ChallengeGroupDetails title={title} description={description} />
    </View>
  );
};

export default memo(ChallengeTypeInfoPage);

const styles = StyleSheet.create({
  ChallengeTypeInfoPage: {
    flex: 1,
    backgroundColor: 'red',
    borderWidth: 10,
    borderColor: 'aqua',
  },
});
