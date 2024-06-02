import {View, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {observer} from 'mobx-react-lite';

import {Category, categoryExample, CategoryType} from '@src/entities/Category';
import {getEntityExampleDataForSkeleton} from '@src/shared/lib/common';
import categoriesStore from '../../model/store/categoriesStore';

interface CategoriesProps {
  isLoading: boolean;
}

const paddings = 10;

const Categories = (props: CategoriesProps) => {
  const {isLoading} = props;
  let categories = categoriesStore.displayedLevels;

  if (isLoading) {
    categories = categoriesStore.editCategories(
      getEntityExampleDataForSkeleton({
        entity: categoryExample,
        count: 6,
      }) as CategoryType[],
    );
  }

  return (
    <View style={styles.categories}>
      <View style={[styles.leftSide, {marginRight: paddings}]}>
        {categories
          .filter(category => category.leftSide)
          .map(category => {
            return (
              <View
                style={[
                  styles.categoryWrapper,
                  {
                    marginTop: paddings,
                  },
                ]}
                key={category.id}>
                <Category
                  allSessionsCount={category.allSessionsCount}
                  isLoading={isLoading}
                  displayName={category.displayName}
                  id={category.id}
                  isBlocked={category.isBlocked}
                  image={category.image.small}
                  size={category.size}
                  name={category.name}
                />
              </View>
            );
          })}
      </View>
      <View style={styles.rightSide}>
        {categories
          .filter(category => !category.leftSide)
          .map(category => {
            return (
              <View
                style={[
                  styles.categoryWrapper,
                  {
                    marginTop: paddings,
                  },
                ]}
                key={category.id}>
                <Category
                  allSessionsCount={category.allSessionsCount}
                  isLoading={isLoading}
                  displayName={category.displayName}
                  id={category.id}
                  isBlocked={category.isBlocked}
                  image={category.image.small}
                  size={category.size}
                  name={category.name}
                />
              </View>
            );
          })}
      </View>
    </View>
  );
};

export default memo(observer(Categories));

const styles = StyleSheet.create({
  categories: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  categoryWrapper: {
    width: '100%',
  },
  leftSide: {
    width: '48%',
  },
  rightSide: {
    width: '48%',
  },
});
