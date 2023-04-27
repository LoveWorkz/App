import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import HorizontalCarousel from '@src/shared/ui/HorizontalCarousel/HorizontalCarousel';
import {
  RubricFilterItem,
  rubricFilterItemStore,
} from '@src/entities/RubricFilterItem';
import challengesStore from '../../model/store/challengesStore';

const FilterItem = memo(({name, active}: {name: string; active: boolean}) => {
  const onFiltreHandler = useCallback((key: string) => {
    challengesStore.filterChallenges(key);
  }, []);

  return (
    <View style={styles.rubricCategory}>
      {name && (
        <RubricFilterItem
          action
          onPress={onFiltreHandler}
          active={active}
          rubric={name}
          text={name}
        />
      )}
    </View>
  );
});

export const ChallengesFilterItems = () => {
  const rubricFilterItems = rubricFilterItemStore.rubricFilterItems;

  // adding an empty object for a space at the beginning
  const rubricFilterItemsWithSpace = useMemo(() => {
    return [{}, ...rubricFilterItems];
  }, [rubricFilterItems]);

  return (
    <View style={[styles.FilterItems]}>
      <HorizontalCarousel
        data={rubricFilterItemsWithSpace}
        Component={FilterItem}
      />
    </View>
  );
};

export default memo(observer(ChallengesFilterItems));

const styles = StyleSheet.create({
  FilterItems: {
    flexDirection: 'row',
  },
  filterItem: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    marginLeft: horizontalScale(10),
  },
  rubricCategory: {
    marginLeft: horizontalScale(10),
  },
});
