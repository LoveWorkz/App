import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {AppText} from '@src/shared/ui/AppText/AppText';
import {horizontalScale} from '@src/shared/lib/Metrics';
import HorizontalCarousel from '@src/shared/ui/HorizontalCarousel/HorizontalCarousel';
import {challengesStore} from '@src/pages/ChallengesPage';
import {SeeAll} from '@src/shared/ui/SeeAll/SeeAll';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {TrendingChallengeType} from '../../model/types/ChallengeTypes';
import {TrendingChallengeExample} from '../../model/lib/challenge';
import TrendingChallenge from './TrendingChallenge';

interface TrendingChallengeWrapperProps {
  challenge: TrendingChallengeType;
  index: number;
  listLength: number;
  isLoading: boolean;
  isSeeAll: boolean;
}

const TrendingChallengeWrapper = memo(
  (props: TrendingChallengeWrapperProps) => {
    const {challenge, index, listLength, isSeeAll} = props;

    const isFirstElement = index === 0;
    const isLastElement = index === listLength - 1;

    let content = challenge && <TrendingChallenge {...props} />;

    const onPress = useCallback(() => {
      navigation.navigate(TabRoutesNames.CHALLENGES);
    }, []);

    if (isSeeAll) {
      content = <SeeAll seeAllTheme="large" onPressHandler={onPress} />;
    }

    return (
      <View
        style={{
          marginLeft: horizontalScale(isFirstElement ? 20 : 15),
          marginRight: horizontalScale(isLastElement ? 20 : 0),
        }}>
        {content}
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
    // this empty object is needed to add a "view all" block
    const listWithEmptyObject = [...trendingChallenges, {}];

    return listWithEmptyObject.map((item, i) => {
      const isLastElement = i === listWithEmptyObject.length - 1;

      return {
        challenge: item,
        isLoading,
        isHomeChallenge: true,
        index: i,
        listLength: listWithEmptyObject.length,
        isSeeAll: isLastElement,
      };
    });
  }, [isLoading, trendingChallenges]);

  if (isLoading) {
    return (
      <View>
        <TrendingChallenge isLoading challenge={TrendingChallengeExample} />
      </View>
    );
  }

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
