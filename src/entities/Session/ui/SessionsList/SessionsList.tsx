import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {horizontalScale} from '@src/shared/lib/Metrics';
import SessionItem from '../SessionItem/SessionItem';
import {SessionType} from '../../model/types/sessionType';

interface SessionsListProps {
  sessions: SessionType[];
}

const SessionsList = (props: SessionsListProps) => {
  const {sessions} = props;

  return (
    <View>
      {sessions.map((item, i) => {
        return (
          <View style={styles.item} key={i.toString()}>
            <SessionItem
              session={item}
              isBlocked={item.isBlocked}
              state={'completed'}
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
