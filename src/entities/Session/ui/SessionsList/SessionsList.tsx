import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {horizontalScale} from '@src/shared/lib/Metrics';
import SessionItem from '../SessionItem/SessionItem';
import {SessionState, SessionType} from '../../model/types/sessionType';

interface SessionsListProps {
  sessions: SessionType[];
  isPremium: boolean;
}

const SessionsList = (props: SessionsListProps) => {
  const {sessions, isPremium} = props;

  // console.log('SESSIONS', sessions);

  return (
    <View>
      {sessions.map((item, i) => {
        let state: SessionState = 'completed';

        if (item.isCurrent) {
          state = 'current';
        }

        if (item.isBlocked) {
          state = 'upcoming';
        }

        return (
          <View style={styles.item} key={i.toString()}>
            <SessionItem session={item} state={state} isPremium={isPremium} />
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
