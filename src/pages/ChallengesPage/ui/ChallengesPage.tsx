import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Loader, LoaderSize} from '@src/shared/ui/Loader/Loader';
import {verticalScale} from '@src/shared/lib/Metrics';
import {CongratsModal} from '@src/widgets/CongratsModal';
import ChallengeCategories from './ChallengeCategories/ChallengeCategories';
import ChallengesFilterItems from './ChallengesFilterItems/ChallengesFilterItems';
import Challenges from './Challenges/Challenges';
import challengesStore from '../model/store/challengesStore';
import {getCongratsModalContentForChallenges} from '../model/lib/challenges';

const ChallengesPage = () => {
  const challengeCategory = challengesStore.challengeCategory;
  const congratsModalContent =
    getCongratsModalContentForChallenges()[
      challengeCategory?.currentChallengeCategory || ''
    ];

  useEffect(() => {
    challengesStore.init();

    return () => {
      challengesStore.clearChallengesInfo();
    };
  }, []);

  if (
    challengesStore.isChallengeCategoriesLoading &&
    challengesStore.isChallengesLoading
  ) {
    return (
      <View style={styles.container}>
        <View>
          <Loader size={LoaderSize.LARGE} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ChallengeCategories />
      <View style={styles.FilterItemsWrapper}>
        <ChallengesFilterItems />
      </View>
      <Challenges />
      <CongratsModal
        visible={challengesStore.isCongratsModalVisible}
        setVisible={challengesStore.setIsCongratsModalVisible}
        content={congratsModalContent}
      />
    </View>
  );
};

export const ComponentWrapper = memo(observer(ChallengesPage));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  FilterItemsWrapper: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
});
