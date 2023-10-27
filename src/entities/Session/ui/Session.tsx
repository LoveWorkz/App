import {observer} from 'mobx-react-lite';
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import sessionStore from '../model/store/sessionStore';
import CategoryBlock from './CategoryBlock/CategoryBlock';
import SessionsList from './SessionsList/SessionsList';

interface SessionProps {
  isCategoryAllInOne: boolean;
  isFetching: boolean;
}

const Session = (props: SessionProps) => {
  const {isCategoryAllInOne, isFetching} = props;

  let sessions = sessionStore.sessions;
  const allSessions = sessionStore.allSessions;

  if (isFetching) {
    return (
      <>
        {[1, 2, 3, 4].map(item => {
          return (
            <View key={item} style={styles.skeletonItem}>
              <Skeleton width={'100%'} height={60} borderRadius={20} />
            </View>
          );
        })}
      </>
    );
  }

  if (isCategoryAllInOne) {
    return (
      <View>
        {allSessions.map((item, i) => {
          return (
            <View key={i.toString()} style={styles.item}>
              <CategoryBlock
                sessions={item.sessions}
                title={item.categoryName}
                categoryKey={item.categoryName}
              />
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View>
      <SessionsList sessions={sessions} />
    </View>
  );
};

export default memo(observer(Session));

const styles = StyleSheet.create({
  skeletonItem: {
    marginBottom: horizontalScale(20),
  },
  item: {
    marginBottom: verticalScale(20),
  },
});
