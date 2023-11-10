import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {verticalScale} from '@src/shared/lib/Metrics';
import {ChallengeType} from '../../model/types/ChallengeTypes';
import CoreChallengesList from '../CoreChallengesList/CoreChallengesList';
import SpecialChallengesList from '../SpecialChallengesList/SpecialChallengesList';

interface ChallengesListProps {
  isLoading: boolean;
  isChallengesLoading: boolean;
  challengesList: ChallengeType[];
}

export const ChallengesList = (props: ChallengesListProps) => {
  const {isLoading, challengesList, isChallengesLoading} = props;

  const coreChallengesList = challengesList;
  const specialChallengesList = challengesList;

  return (
    <>
      <View style={styles.coreChallengesListWrapper}>
        <CoreChallengesList
          isLoading={isLoading}
          isChallengesLoading={isChallengesLoading}
          challengesList={coreChallengesList}
        />
      </View>
      <SpecialChallengesList
        isLoading={isLoading}
        isChallengesLoading={isChallengesLoading}
        challengesList={specialChallengesList}
      />
    </>
  );
};

export default memo(observer(ChallengesList));

const styles = StyleSheet.create({
  coreChallengesListWrapper: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(30),
  },
});
