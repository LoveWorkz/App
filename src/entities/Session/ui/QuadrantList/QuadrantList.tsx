import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import Quadrant from '../Quadrant';
import {horizontalScale, moderateScale, verticalScale} from '@src/shared/lib/Metrics';
import sessionStore from '../../model/store/sessionStore';
import {QuadrantType} from '../../model/types/sessionType';
import SessionsList from '../SessionsList/SessionsList';

const quadrantList: QuadrantType[] = [
  {
    step: 'First Step',
    title: 'Personal Growth',
    description:
      "Exploring individual personalities and life backgrounds; beginning to understand each other's basic needs and preferences.",
    id: 'id_1',
    sessions: [],
  },
  {
    step: 'Second Step',
    title: 'Friendship',
    description:
      'Starting to build trust and enjoy each other’s company; engaging in light, enjoyable activities together.',
    id: 'id_2',
    sessions: [],
  },
  {
    step: 'Third Step',
    title: 'Communication & Conflictm.',
    description:
      'Learn how to face the challenges and opportunities that come with being in a relationship, such as financial issues, career changes, family matters, and health problems',
    id: 'id_3',
    sessions: [],
  },
  {
    step: 'Fourth Step',
    title: 'Shared Meaning',
    description:
      'Sharing initial aspirations and hopes; discussing short-term goals and plans.',
    id: 'id_4',
    sessions: [],
  },
];

interface QuadrantListProps {
  isFetching: boolean;
}

const QuadrantList = (props: QuadrantListProps) => {
  const {isFetching} = props;

  const sessionsCount = sessionStore.getUserSessionsCount();

  if (isFetching) {
    return (
      <>
        {Array.from({length: sessionsCount}, (_, i) => i + 1).map(item => {
          return (
            <View key={item} style={styles.skeletonItem}>
              <Skeleton width={'100%'} height={verticalScale(150)} borderRadius={moderateScale(20)} />
            </View>
          );
        })}
      </>
    );
  }

  return (
    <View>
      {quadrantList.map(quadrant => {
        return (
          <View key={quadrant.id} style={styles.item}>
            <Quadrant isBlocked={false} quadrant={quadrant} />
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
