import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import HorizontalCarousel from '@src/shared/ui/HorizontalCarousel/HorizontalCarousel';
import {
  RubricFilterItem,
  rubricFilterItemStore,
} from '@src/entities/RubricFilterItem';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import challengesStore from '../../model/store/challengesStore';

interface FilterItemProps {
  name: string;
  active: boolean;
  isLoading: boolean;
}

const FilterItem = memo((props: FilterItemProps) => {
  const {name, active, isLoading} = props;

  const {theme} = useTheme();
  const isDarkMode = theme === Theme.Dark;

  const onFiltreHandler = useCallback((key: string) => {
    challengesStore.filterChallenges(key);
  }, []);

  return (
    <View style={styles.rubricCategory}>
      {name && (
        <RubricFilterItem
          isLoading={isLoading}
          isOutline={isDarkMode}
          action
          onPress={onFiltreHandler}
          active={active}
          rubric={name}
          displayName={name}
        />
      )}
    </View>
  );
});
interface ChallengesFilterItemsProps {
  isLoading: boolean;
}

export const ChallengesFilterItems = (props: ChallengesFilterItemsProps) => {
  const {isLoading} = props;
  const rubricFilterItems = rubricFilterItemStore.rubricFilterItems;

  const filterItemsWithIsLoading = useMemo(() => {
    return rubricFilterItems.map(rubricFilterItem => ({
      ...rubricFilterItem,
      isLoading: isLoading,
    }));
  }, [isLoading, rubricFilterItems]);

  // adding an empty object for a space at the beginning
  const rubricFilterItemsWithSpace = useMemo(() => {
    return [{}, ...filterItemsWithIsLoading];
  }, [filterItemsWithIsLoading]);

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
