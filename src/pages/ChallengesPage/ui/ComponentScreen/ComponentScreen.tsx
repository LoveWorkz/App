import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {memo} from 'react';

import {
  CoreChallengesList,
  SpecialChallengesList,
} from '@src/entities/Challenge';
import {verticalScale} from '@src/shared/lib/Metrics';
import challengesStore from '../../model/store/challengesStore';
import ChallengeCategories from '../ChallengeCategories/ChallengeCategories';

interface ComponentScreenProps {
  isCore?: boolean;
}

const ComponentScreen = (props: ComponentScreenProps) => {
  const {isCore = false} = props;

  const isLoading = challengesStore.isChallengePageLoading;
  const challenges = challengesStore.challenges;
  const specialChallenges = challengesStore.specialChallenges;
  const isChallengesLoading = challengesStore.isChallengesLoading;

  return (
    <View style={styles.ComponentScreen}>
      <ChallengeCategories isLoading={isLoading} />
      <View style={styles.line} />
      {isCore ? (
        <CoreChallengesList
          isLoading={isLoading}
          isChallengesLoading={isChallengesLoading}
          challengeList={challenges}
        />
      ) : (
        <SpecialChallengesList
          isLoading={isLoading}
          isChallengesLoading={isChallengesLoading}
          challengeList={specialChallenges}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ComponentScreen: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: verticalScale(20),
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    marginTop: verticalScale(15),
    marginBottom: verticalScale(15),
  },
});

export default memo(observer(ComponentScreen));
