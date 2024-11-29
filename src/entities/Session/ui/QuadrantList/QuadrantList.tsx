import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import SessionsList from '../SessionsList/SessionsList';
import Quadrant from '../Quadrant';
import {QuadrantType} from '../../model/types/sessionType';
import {globalPadding} from '@src/app/styles/GlobalStyle';

interface QuadrantListProps {
  quadrantList: QuadrantType[];
  isLoading: boolean;
  withBottomSpace?: boolean;
  allSessionsCount: number;
}

const QuadrantList = (props: QuadrantListProps) => {
  const {
    quadrantList,
    isLoading,
    withBottomSpace = true,
    allSessionsCount,
  } = props;

  if (isLoading) {
    return (
      <>
        {Array.from({length: allSessionsCount}, (_, i) => i + 1).map(item => {
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
    <View style={{marginHorizontal: horizontalScale(globalPadding)}}>
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
            {quadrant.step && (
              <Quadrant
                isPremium={quadrant.isPremium}
                isBlocked={quadrant.isBlocked}
                quadrant={quadrant}
              />
            )}
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
    marginHorizontal: horizontalScale(globalPadding),
    marginBottom: horizontalScale(15),
  },
});
