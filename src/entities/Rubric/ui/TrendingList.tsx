import {View, StyleSheet} from 'react-native';
import React, {memo, useMemo} from 'react';
import {observer} from 'mobx-react-lite';

import {Rubric, rubricExample, RubricType} from '@src/entities/Rubric';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {AppText} from '@src/shared/ui/AppText/AppText';
import HorizontalCarousel from '@src/shared/ui/HorizontalCarousel/HorizontalCarousel';
import rubricStore from '../model/store/rubricStore';

interface RubricWrapperProps {
  rubric: RubricType;
  isLoading: boolean;
  isHomeChallenge?: boolean;
  index: number;
  listLength: number;
}

const RubricWrapper = memo((props: RubricWrapperProps) => {
  const {rubric, index, listLength} = props;

  const isFirstElement = index === 0;
  const isLastElement = index === listLength - 1;

  return (
    <View
      style={{
        marginLeft: horizontalScale(isFirstElement ? 20 : 10),
        marginRight: horizontalScale(isLastElement ? 20 : 0),
      }}>
      {rubric && <Rubric {...props} />}
    </View>
  );
});

interface TrendingListProps {
  isLoading: boolean;
}

const TrendingList = (props: TrendingListProps) => {
  const {isLoading} = props;

  const rubrics = rubricStore.rubrics;

  const list = useMemo(() => {
    const trendingTopicsLIst = rubricStore.findTopTrendingTopics(rubrics);

    return trendingTopicsLIst.map((item, i) => {
      return {
        rubric: item,
        isLoading,
        isHomeChallenge: true,
        index: i,
        listLength: trendingTopicsLIst.length,
      };
    });
  }, [isLoading, rubrics]);

  if (isLoading) {
    return (
      <View>
        <Rubric isLoading isHomeChallenge rubric={rubricExample} />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.titleWrapper}>
        <AppText weight={'500'} text={'Trending topics'} />
      </View>
      <HorizontalCarousel data={list} Component={RubricWrapper} />
    </View>
  );
};

export default memo(observer(TrendingList));

const styles = StyleSheet.create({
  titleWrapper: {
    marginBottom: horizontalScale(15),
  },
  title: {},
  rubricWrapper: {
    marginLeft: horizontalScale(10),
  },
});
