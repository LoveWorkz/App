import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {ChallengeCategory} from '@src/entities/ChallengeCategory';
import challengesStore from '../../model/store/challengesStore';

interface ChallengeCategoriesProps {
  defaultChallengeId?: string;
}

export const ChallengeCategories = (props: ChallengeCategoriesProps) => {
  const {defaultChallengeId} = props;
  const challengeCategories = challengesStore.challengeCategories;

  const onChallengeCategoryPressHandler = useCallback(
    ({id, name}: {id: string; name: string}) => {
      challengesStore.selectChallengeCategory({id, name});
    },
    [],
  );

  return (
    <View style={styles.ChallengeCategories}>
      {challengeCategories.map(challange => {
        return (
          <ChallengeCategory
            key={challange.id}
            image={challange.image}
            name={challange.name}
            isActive={challange.isActive as boolean}
            isBlocked={challange.isBlocked}
            selectChallngeCategory={onChallengeCategoryPressHandler}
            id={challange.id}
            displayName={challange.displayName}
            defaultChallengeId={defaultChallengeId}
          />
        );
      })}
    </View>
  );
};

export default memo(observer(ChallengeCategories));

const styles = StyleSheet.create({
  ChallengeCategories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
