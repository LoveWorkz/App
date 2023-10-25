import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import Session from '../Session';
import sessionStore from '../../model/store/sessionStore';

interface SessionsListProps {
  isFetching?: boolean;
}

const SessionsList = (props: SessionsListProps) => {
  const {isFetching} = props;

  const sessions = sessionStore.sessions;

  return (
    <View>
      {sessions.map((item, i) => {
        const lastIndex = sessions.length - 1;
        const isLastElement = lastIndex === i;
        const sessionNumber = item.sessionNumber.toString();

        return (
          <View style={styles.item} key={sessionNumber}>
            {!isLastElement && !isFetching && (
              <Gradient style={styles.verticalLine} />
            )}
            <Session
              isMarked={item.isMarked}
              isLoading={isFetching}
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
    marginBottom: 20,
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
