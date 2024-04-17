import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import sessionStore from '../../model/store/sessionStore';
import SessionsList from '../SessionsList/SessionsList';
import Quadrant from '../Quadrant';
import {QuadrantType} from '../../model/types/sessionType';

interface QuadrantListProps {
  quadrantList: QuadrantType[];
  isLoading: boolean;
  withBottomSpace?: boolean;
}

const QuadrantList = (props: QuadrantListProps) => {
  const {quadrantList, isLoading, withBottomSpace = true} = props;

  const sessionsCount = sessionStore.getAllSessionsCount();

  if (isLoading) {
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
      {quadrantList.map((quadrant, i) => {
        const isLastElement = i === quadrantList.length - 1;
        const marginBottom = horizontalScale(40);
        const marginBottomForLastElement = withBottomSpace ? marginBottom : 0;

        return (
          <View
            key={quadrant.id}
            style={{
              marginBottom: isLastElement
                ? marginBottomForLastElement
                : marginBottom,
            }}>
            <Quadrant
              isPremium={quadrant.isPremium}
              isBlocked={quadrant.isBlocked}
              quadrant={quadrant}
            />
            <SessionsList
              isPremium={quadrant.isPremium}
              sessions={quadrant.sessions}
            />
          </View>
        );
      })}
    </View>
  );
};

export default memo(QuadrantList);

const styles = StyleSheet.create({
  skeletonItem: {
    marginBottom: horizontalScale(15),
  },
});
