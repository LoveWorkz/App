import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

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
        <Text style={styles.status}>{status}</Text>
        <Text style={styles.status}>{`${count}/40`}</Text>
      </View>
      <Text style={styles.text}>To get to know each other better</Text>
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
  status: {
    fontSize: 18,
    fontWeight: '700',
  },
  text: {
    fontSize: 16,
    color: '#9A9AA5',
  },
});
