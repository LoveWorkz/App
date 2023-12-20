import {observer} from 'mobx-react-lite';
import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import goalStore from '../model/store/goalStore';
import Goal from './Goal';

const GoalsList = () => {
  const goals = goalStore.goals;
  const isFetching = goalStore.isFetching;

  useEffect(() => {
    goalStore.fetchGoals();
  }, []);

  const onChangeGoalStatus = useCallback((id: string) => {
    goalStore.toggleGoalStatus(id);
  }, []);

  if (isFetching) {
    return (
      <>
        {Array.from({length: 6}, (_, i) => i + 1).map(item => {
          return (
            <View key={item} style={styles.item}>
              <Skeleton width={'100%'} height={92} borderRadius={20} />
            </View>
          );
        })}
      </>
    );
  }

  return (
    <>
      {goals.map(goal => {
        return (
          <View style={styles.item} key={goal.id}>
            <Goal
              {...goal}
              keyName={goal.key}
              onChangeGoalStatus={onChangeGoalStatus}
            />
          </View>
        );
      })}
    </>
  );
};

export default memo(observer(GoalsList));

const styles = StyleSheet.create({
  item: {
    marginBottom: 15,
  },
});
