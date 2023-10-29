import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {horizontalScale} from '@src/shared/lib/Metrics';
import SessionItem from '../SessionItem/SessionItem';
import {SessionType} from '../../model/types/sessionType';
import sessionStore from '../../model/store/sessionStore';

interface SessionsListProps {
  sessions: SessionType[];
}

const SessionsList = (props: SessionsListProps) => {
  const {sessions} = props;

  const markedSessionsMap = sessionStore.markedSessionsMap;

  return (
    <View>
      {sessions.map((item, i) => {
        const lastIndex = sessions.length - 1;
        const isLastElement = lastIndex === i;
        const sessionNumber = item.sessionNumber.toString();

        return (
          <View style={styles.item} key={i.toString()}>
            {!isLastElement && <Gradient style={styles.verticalLine} />}
            <SessionItem
              isMarked={markedSessionsMap[item.id]}
              session={item}
              count={sessionNumber}
              isBlocked={item.isBlocked}
              sessionId={item.id}
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
    marginBottom: horizontalScale(20),
  },
  verticalLine: {
    backgroundColor: 'red',
    height: 38,
    width: 1,
    position: 'absolute',
    bottom: -30,
    left: 12,
    opacity: 0.5,
  },
});
