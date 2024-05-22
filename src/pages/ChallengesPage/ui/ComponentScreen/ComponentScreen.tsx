import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {memo} from 'react';

import {renderChallenges} from '@src/entities/Challenge/ui/CoreChallengesList/CoreChallengesList';
import ScrollViewWithoutIndicator from '@src/shared/ui/ScrollViewWithoutIndicator/ScrollViewWithoutIndicator';
import {favoriteStore} from '@src/entities/Favorite';
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

  const coreChallengeFavorites = favoriteStore.coreChallengeFavorites;
  const specialChallengeFavorites = favoriteStore.specialChallengeFavorites;

  if (isFavortePage) {
    const favoriteCoreChallengesList = challenges.filter(challenge =>
      (coreChallengeFavorites?.ids || []).includes(challenge.id),
    );

    const favoriteSpecialChallengesList = specialChallenges.filter(challenge =>
      (specialChallengeFavorites?.ids || []).includes(challenge.id),
    );

    return (
      <View style={styles.ComponentScreen}>
        <ChallengeCategories isLoading={isLoading} />
        <View style={styles.line} />
        {isCore ? (
          <ScrollViewWithoutIndicator>
            <>
              {!!favoriteCoreChallengesList.length &&
                favoriteCoreChallengesList.map((item, i) =>
                  renderChallenges({isCore: true, item, index: i}),
                )}
            </>
          </ScrollViewWithoutIndicator>
        ) : (
          <ScrollViewWithoutIndicator>
            <>
              {!!favoriteSpecialChallengesList.length &&
                favoriteSpecialChallengesList.map((item, i) =>
                  renderChallenges({isCore: false, item, index: i}),
                )}
            </>
          </ScrollViewWithoutIndicator>
        )}
      </View>
    );
  }

  return (
    <View style={styles.ComponentScreen}>
      <ChallengeCategories isLoading={isLoading} />
      <View style={styles.line} />
      {isCore ? (
        <>
          <Favorites favorites={coreChallengeFavorites} isLoading={isLoading} />
          <CoreChallengesList
            isLoading={isLoading || isChallengesLoading}
            challengeList={challenges}
          />
        </>
      ) : (
        <>
          <Favorites
            favorites={specialChallengeFavorites}
            isLoading={isLoading}
          />
          <SpecialChallengesList
            isLoading={isLoading || isChallengesLoading}
            challengeList={specialChallenges}
          />
        </>
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
    marginBottom: verticalScale(15),
    marginTop: verticalScale(15),
  },
});

export default memo(observer(ComponentScreen));
