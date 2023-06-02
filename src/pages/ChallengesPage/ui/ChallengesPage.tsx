import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {verticalScale} from '@src/shared/lib/Metrics';
import {CongratsModal} from '@src/widgets/CongratsModal';
import {ChallengeCategoryKeys} from '@src/entities/ChallengeCategory';
import {LoaderWrapper} from '@src/shared/ui/LoaderWrapper/LoaderWrapper';
import {rubricFilterItemStore} from '@src/entities/RubricFilterItem';
import {challengeFilterItems} from '@src/entities/Challenge';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import ChallengeCategories from './ChallengeCategories/ChallengeCategories';
import ChallengesFilterItems from './ChallengesFilterItems/ChallengesFilterItems';
import Challenges from './Challenges/Challenges';
import challengesStore from '../model/store/challengesStore';
import {getCongratsModalContentForChallenges} from '../model/lib/challenges';

interface ChallengesPageProps {
  route?: {params: {id: string; prevRouteName: AppRouteNames | TabRoutesNames}};
}

const ChallengesPage = (props: ChallengesPageProps) => {
  const {route} = props;
  const defaultChallengeId = route?.params?.id;
  const prevRouteName = route?.params?.prevRouteName;

  const challengeCategory = challengesStore.challengeCategory;
  const congratsModalContent =
    getCongratsModalContentForChallenges()[
      challengeCategory?.currentChallengeCategory as ChallengeCategoryKeys
    ];
  const isLoading = challengesStore.isChallengePageLoading;

  useEffect(() => {
    challengesStore.init();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (prevRouteName === AppRouteNames.SETTINGS) {
        return;
      }

      rubricFilterItemStore.setRubricFilterItems(challengeFilterItems);
      challengesStore.clearChallengesInfo();
    }, [prevRouteName]),
  );

  return (
    <LoaderWrapper isLoading={isLoading}>
      <View style={styles.container}>
        <ChallengeCategories defaultChallengeId={defaultChallengeId} />
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

export default memo(observer(ChallengesPage));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  FilterItemsWrapper: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
});
