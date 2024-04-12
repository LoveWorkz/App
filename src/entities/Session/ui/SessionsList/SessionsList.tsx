import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {horizontalScale} from '@src/shared/lib/Metrics';
import {categoryStore} from '@src/entities/Category';
import SessionItem from '../SessionItem/SessionItem';
import {SessionState, SessionType} from '../../model/types/sessionType';

interface SessionsListProps {
  sessions: SessionType[];
}

const SessionsList = (props: SessionsListProps) => {
  const {sessions} = props;
  const currentLevel = categoryStore.category;

  return (
    <View>
      {sessions.map((item, i) => {
        let state: SessionState = 'completed';

        if (item.isBlocked) {
          state = 'upcoming';
        }
        if (item.sessionNumber === currentLevel?.currentSessionNumber) {
          state = 'current';
        }

        return (
          <View style={styles.item} key={i.toString()}>
            <SessionItem
              session={item}
              isBlocked={item.isBlocked}
              state={state}
            />
          </View>
        );
      })}
    </View>
  );
};

export default memo(observer(SessionsList));

const styles = StyleSheet.create({
  item: {
    marginTop: horizontalScale(15),
  },
});
