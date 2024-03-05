import {observer} from 'mobx-react-lite';
import React, {memo, useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import goalStore from '../model/store/goalStore';
import Goal from './Goal';

const GoalsList = () => {
  const goals = goalStore.goals;
  const isFetching = goalStore.isFetching;

  useEffect(() => {
    goalStore.init();
  }, []);

  const onChangeGoalStatus = useCallback((id: string) => {
    goalStore.toggleGoalStatus(id);
  }, []);

  if (isFetching) {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Array.from({length: 6}, (_, i) => i + 1)}
        renderItem={({item}) => (
          <View key={item} style={styles.item}>
            <Skeleton width={'100%'} height={92} borderRadius={20} />
          </View>
        )}
        keyExtractor={item => item.toString()}
      />
    );
  }

  return (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={goals}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Goal
              {...item}
              keyName={item.key}
              onChangeGoalStatus={onChangeGoalStatus}
            />
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </>
  );
};

export default memo(observer(GoalsList));

const styles = StyleSheet.create({
  item: {
    marginBottom: 15,
  },
});
