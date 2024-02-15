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
import Favorites from '../Favorites/Favorites';

interface ComponentScreenProps {
  isCore?: boolean;
  isFavortePage?: boolean;
}

const ComponentScreen = (props: ComponentScreenProps) => {
  const {isCore = false, isFavortePage = false} = props;

  const isLoading = challengesStore.isChallengePageLoading;
  const challenges = challengesStore.challenges;
  const specialChallenges = challengesStore.specialChallenges;
  const isChallengesLoading = challengesStore.isChallengesLoading;

  if (isFavortePage) {
    return (
      <View style={styles.ComponentScreen}>
        <ChallengeCategories isLoading={isLoading} />
        <View style={styles.line} />
        {isCore ? (
          <></>
        ) : (
          <SpecialChallengesList
            isLoading={isLoading}
            isChallengesLoading={isChallengesLoading}
            challengeList={specialChallenges}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.ComponentScreen}>
      <ChallengeCategories isLoading={isLoading} />
      <View style={styles.line} />
      <View style={styles.favorites}>
        <Favorites />
      </View>
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
  },
  favorites: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(15),
  },
});

export default memo(observer(ComponentScreen));
