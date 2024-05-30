import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {AppText} from '@src/shared/ui/AppText/AppText';
import {horizontalScale} from '@src/shared/lib/Metrics';
import HorizontalCarousel from '@src/shared/ui/HorizontalCarousel/HorizontalCarousel';
import {challengesStore} from '@src/pages/ChallengesPage';
import TrendingChallenge from './TrendingChallenge';
import {TrendingChallengeType} from '../../model/types/ChallengeTypes';

interface TrendingChallengeWrapperProps {
  challenge: TrendingChallengeType;
  index: number;
  listLength: number;
  isLoading: boolean;
}

const TrendingChallengeWrapper = memo(
  (props: TrendingChallengeWrapperProps) => {
    const {challenge, index, listLength, isLoading} = props;

    const isFirstElement = index === 0;
    const isLastElement = index === listLength - 1;

    return (
      <View
        style={{
          marginLeft: horizontalScale(isFirstElement ? 20 : 15),
          marginRight: horizontalScale(isLastElement ? 20 : 0),
        }}>
        {challenge && (
          <TrendingChallenge isLoading={isLoading} challenge={challenge} />
        )}
      </View>
    );
  },
);

interface ChallengeGroupProps {
  isLoading: boolean;
}

const TrendingChallengeList = (props: ChallengeGroupProps) => {
  const {isLoading} = props;

  const trendingChallenges = challengesStore.trendingChallenges;

  const trendingListWithMetadata = useMemo(() => {
    return trendingChallenges.map((item, i) => {
      return {
        challenge: item,
        isLoading,
        isHomeChallenge: true,
        index: i,
        listLength: trendingChallenges.length,
      };
    });
  }, [isLoading, trendingChallenges]);

  return (
    <View>
      {!isLoading && (
        <View style={styles.titleWrapper}>
          <AppText weight={'500'} text={'Trending challenges'} />
        </View>
      )}
      <HorizontalCarousel
        data={trendingListWithMetadata}
        Component={TrendingChallengeWrapper}
      />
    </View>
  );
};

export default memo(observer(TrendingChallengeList));

const styles = StyleSheet.create({
  titleWrapper: {
    marginBottom: horizontalScale(10),
  },
});
