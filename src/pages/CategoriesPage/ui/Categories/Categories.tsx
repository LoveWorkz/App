import {View, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {Category} from '@src/entities/Category';
import {globalPadding} from '@src/app/styles/GlobalStyle';
import CategoriesStore from '../../model/store/categoriesStore';

const Categories = () => {
  const colors = useColors();
  const {t} = useTranslation();
  const categories = CategoriesStore.categories;

  return (
    <View>
      <AppText
        style={{color: colors.primaryTextColor}}
        weight={'500'}
        size={TextSize.LEVEL_5}
        text={t('categories.categories')}
      />
      <View style={styles.categories}>
        <View style={[styles.leftSide, {marginRight: globalPadding}]}>
          {categories
            .filter(category => category.leftSide)
            .map(category => {
              return (
                <View
                  style={[
                    styles.categoryWrapper,
                    {
                      marginTop: globalPadding,
                    },
                  ]}
                  key={category.id}>
                  <Category
                    id={category.id}
                    isBlocked={category.isBlocked}
                    image={category.image.small}
                    size={category.size}
                    name={category.name}
                    questions={category.questions}
                    isCategoryDetailsVisible={category.isCategoryDetailsVisible}
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
                      marginTop: globalPadding,
                    },
                  ]}
                  key={category.id}>
                  <Category
                    id={category.id}
                    isBlocked={category.isBlocked}
                    image={category.image.small}
                    size={category.size}
                    name={category.name}
                    questions={category.questions}
                    isCategoryDetailsVisible={category.isCategoryDetailsVisible}
                  />
                </View>
              );
            })}
        </View>
      </View>
    </View>
  );
};

export default memo(observer(Categories));

const styles = StyleSheet.create({
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryWrapper: {
    width: '100%',
  },
  leftSide: {
    width: '47%',
  },
  rightSide: {
    width: '47%',
  },
});
