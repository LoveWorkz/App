import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {ArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {Challange} from '@src/entities/Challange';
import {navigate} from '@src/shared/config/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';

const data = [
  {
    text: 'Bronze',
    active: true,
  },
  {
    text: 'Silver',
    active: false,
  },
  {
    text: 'Gold',
    active: false,
  },
];

const Challanges = () => {
  const onPressHandler = () => {
    navigate(TabRoutesNames.CHALLENGES);
  };

  return (
    <View>
      <View style={styles.topBlock}>
        <Text style={styles.title}>Chalanges</Text>
        <Pressable onPress={onPressHandler}>
          <View style={styles.seeAllWrapper}>
            <Text style={styles.seeAll}>See all</Text>
            <SvgXml xml={ArrowRightIcon} style={styles.arrowIcon} />
          </View>
        </Pressable>
      </View>
      <View style={styles.challanges}>
        {data.map(item => {
          return (
            <Challange key={item.text} text={item.text} active={item.active} />
          );
        })}
      </View>
    </View>
  );
};

export const ComponentWrapper = memo(Challanges);

const styles = StyleSheet.create({
  seeAll: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 5,
  },
  arrowIcon: {
    height: 15,
    width: 15,
  },
  seeAllWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
  },
  topBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  challanges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
