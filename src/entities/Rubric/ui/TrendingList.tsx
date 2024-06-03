import {View, StyleSheet} from 'react-native';
import React, {memo, useCallback, useMemo} from 'react';
import {observer} from 'mobx-react-lite';

import {Rubric, rubricExample, RubricType} from '@src/entities/Rubric';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {AppText} from '@src/shared/ui/AppText/AppText';
import HorizontalCarousel from '@src/shared/ui/HorizontalCarousel/HorizontalCarousel';
import {SeeAll} from '@src/shared/ui/SeeAll/SeeAll';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import rubricStore from '../model/store/rubricStore';

interface RubricWrapperProps {
  rubric: RubricType;
  isLoading: boolean;
  isHomeChallenge?: boolean;
  index: number;
  listLength: number;
  isSeeAll: boolean;
}

const RubricWrapper = memo((props: RubricWrapperProps) => {
  const {rubric, index, listLength, isSeeAll} = props;

  const isFirstElement = index === 0;
  const isLastElement = index === listLength - 1;

  let content = rubric && <Rubric {...props} />;

  const onPress = useCallback(() => {
    navigation.navigate(TabRoutesNames.TOPICS);
  }, []);

  if (isSeeAll) {
    content = <SeeAll onPressHandler={onPress} />;
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
});

interface TrendingListProps {
  isLoading: boolean;
}

const TrendingList = (props: TrendingListProps) => {
  const {isLoading} = props;

  const rubrics = rubricStore.rubrics;

  const list = useMemo(() => {
    const trendingTopicsLIst = rubricStore.findTopTrendingTopics(rubrics);

    // this empty object is needed to add a "view all" block
    const listWithEmptyObject = [...trendingTopicsLIst, {}];

    return listWithEmptyObject.map((item, i) => {
      const isLastElement = i === listWithEmptyObject.length - 1;
      return {
        rubric: item,
        isLoading,
        isHomeChallenge: true,
        index: i,
        listLength: listWithEmptyObject.length,
        isSeeAll: isLastElement,
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
    marginBottom: horizontalScale(10),
  },
  rubricWrapper: {
    marginLeft: horizontalScale(10),
  },
});
