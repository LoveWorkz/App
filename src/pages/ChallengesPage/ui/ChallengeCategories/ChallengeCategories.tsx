import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {
  ChallengeCategory,
  challengeCategoryExample,
  ChallengeCategoryType,
} from '@src/entities/ChallengeCategory';
import challengesStore from '../../model/store/challengesStore';
import {getEntityExampleDataForSkeleton} from '@src/shared/lib/common';
import CategoryBlockedModal from '@src/entities/ChallengeCategory/ui/CategoryBlockedModal';

interface ChallengeCategoriesProps {
  isLoading?: boolean;
  defaultChallengeId?: string;
}

export const ChallengeCategories = (props: ChallengeCategoriesProps) => {
  const [visible, setVisible] = useState(false);
  const {defaultChallengeId, isLoading} = props;
  let challengeCategories = challengesStore.challengeCategories;

  if (isLoading) {
    challengeCategories = getEntityExampleDataForSkeleton({
      entity: challengeCategoryExample,
      count: 5,
    }) as ChallengeCategoryType[];
  }

  const onChallengeCategoryPressHandler = useCallback(
    ({id, name}: {id: string; name: string}) => {
      challengesStore.selectChallengeCategory({id, name});
    },
    [],
  );

  return (
    <>
      <View style={styles.ChallengeCategories}>
        {challengeCategories.map(challange => {
          return (
            <ChallengeCategory
              isLoading={isLoading}
              key={challange.id}
              image={challange.image}
              name={challange.name}
              isActive={challange.isActive as boolean}
              isBlocked={challange.isBlocked}
              selectChallngeCategory={onChallengeCategoryPressHandler}
              id={challange.id}
              displayName={challange.displayName}
              defaultChallengeId={defaultChallengeId}
              onPressBlockedCategory={() => setVisible(true)}
            />
          );
        })}
        <CategoryBlockedModal visible={visible} setVisible={setVisible} />
      </View>
    </>
  );
};

export default memo(observer(ChallengeCategories));

const styles = StyleSheet.create({
  ChallengeCategories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
