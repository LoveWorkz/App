import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

export const categoryData = [
  {
    status: 'DEEP',
    count: 5,
  },
  {
    status: 'BASIC',
    count: 6,
  },
  {
    status: 'DEEP',
    count: 4,
  },
  {
    status: 'BASIC',
    count: 2,
  },
  {
    status: 'BASIC',
    count: 1,
  },
];

interface CategoryProps {
  status: string;
  count: number;
}

const Category = (props: CategoryProps) => {
  const {count = 0, status} = props;

  return (
    <View style={styles.category}>
      <View style={styles.topBlock}>
        <AppText weight={'700'} size={TextSize.LEVEL_4} text={status} />
        <AppText weight={'700'} size={TextSize.LEVEL_4} text={`${count}/40`} />
      </View>
    </View>
  );
};

export const ComponentWrapper = memo(Category);

const styles = StyleSheet.create({
  category: {
    padding: 10,
    height: 220,
    width: 190,
    backgroundColor: '#ECEFF1',
    borderRadius: 20,
  },
  topBlock: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#9A9AA5',
  },
});
