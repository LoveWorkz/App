import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import Quadrant from '../Quadrant';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import sessionStore from '../../model/store/sessionStore';
import SessionsList from '../SessionsList/SessionsList';

const QuadrantList = () => {
  const sessionsCount = sessionStore.getAllSessionsCount();
  const quadrants = sessionStore.quadrants;
  const isFetching = sessionStore.isFetching;

  if (isFetching) {
    return (
      <>
        {Array.from({length: sessionsCount}, (_, i) => i + 1).map(item => {
          return (
            <View key={item} style={styles.skeletonItem}>
              <Skeleton
                width={'100%'}
                height={verticalScale(150)}
                borderRadius={moderateScale(20)}
              />
            </View>
          );
        })}
      </>
    );
  }

  return (
    <View>
      {quadrants.map(quadrant => {
        return (
          <View key={quadrant.id} style={styles.item}>
            <Quadrant isBlocked={quadrant.isBlocked} quadrant={quadrant} />
            <SessionsList sessions={quadrant.sessions} />
          </View>
        );
      })}
    </View>
  );
};

export default memo(observer(QuadrantList));

const styles = StyleSheet.create({
  item: {
    marginBottom: horizontalScale(40),
  },
  skeletonItem: {
    marginBottom: horizontalScale(15),
  },
});
