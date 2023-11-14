import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {verticalScale} from '@src/shared/lib/Metrics';
import {
  ChallengeType,
  SpecialChallengeType,
} from '../../model/types/ChallengeTypes';
import CoreChallengesList from '../CoreChallengesList/CoreChallengesList';
import SpecialChallengesList from '../SpecialChallengesList/SpecialChallengesList';

interface ChallengesListProps {
  isLoading: boolean;
  isChallengesLoading: boolean;
  challengesList: ChallengeType[];
  specialChallangesList: SpecialChallengeType[];
}

export const ChallengesList = (props: ChallengesListProps) => {
  const {
    isLoading,
    challengesList,
    isChallengesLoading,
    specialChallangesList,
  } = props;

  return (
    <>
      <View style={styles.coreChallengesListWrapper}>
        <CoreChallengesList
          isLoading={isLoading}
          isChallengesLoading={isChallengesLoading}
          challengesList={challengesList}
        />
      </View>
      <SpecialChallengesList
        isLoading={isLoading}
        isChallengesLoading={isChallengesLoading}
        challengesList={specialChallangesList}
      />
    </>
  );
};

export default memo(ChallengesList);

const styles = StyleSheet.create({
  coreChallengesListWrapper: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(30),
  },
});
