import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {verticalScale} from '@src/shared/lib/Metrics';
import {CongratsModal} from '@src/widgets/CongratsModal';
import {ChallengeCategoryKeys} from '@src/entities/ChallengeCategory';
import {LoaderWrapper} from '@src/shared/ui/LoaderWrapper/LoaderWrapper';
import ChallengeCategories from './ChallengeCategories/ChallengeCategories';
import ChallengesFilterItems from './ChallengesFilterItems/ChallengesFilterItems';
import Challenges from './Challenges/Challenges';
import challengesStore from '../model/store/challengesStore';
import {getCongratsModalContentForChallenges} from '../model/lib/challenges';

const ChallengesPage = () => {
  const challengeCategory = challengesStore.challengeCategory;
  const congratsModalContent =
    getCongratsModalContentForChallenges()[
      challengeCategory?.currentChallengeCategory as ChallengeCategoryKeys
    ];
  const isLoading = challengesStore.isChallengePageLoading;

  useEffect(() => {
    challengesStore.init();

    return () => {
      challengesStore.clearChallengesInfo();
    };
  }, []);

  return (
    <LoaderWrapper isLoading={isLoading}>
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
    </LoaderWrapper>
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
