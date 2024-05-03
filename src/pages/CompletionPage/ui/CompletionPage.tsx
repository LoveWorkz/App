import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {windowWidth} from '@src/app/styles/GlobalStyle';
import {Carousel} from '@src/shared/ui/Carousel/Carousel';
import {verticalScale} from '@src/shared/lib/Metrics';
import CompletionItem from './CompletionItem';
import completionPageStore from '../model/store/completionPageStore';
import {ratingInformationList} from '../model/lib/completionPageLib';

const CompletionPage = () => {
  const setRating = completionPageStore.setRating;

  const isFetching = completionPageStore.isFetching;
  const sessionRatingResults = completionPageStore.sessionRatingResults;

  useFocusEffect(
    useCallback(() => {
      completionPageStore.init();
    }, []),
  );

  const newListWithMetadata = useMemo(() => {
    return ratingInformationList.map(item => {
      const setValue = (value: string | number) =>
        setRating({field: item.pagekey, value});

      return {
        ...item,
        setValue,
        value: sessionRatingResults[item.pagekey],
      };
    });
  }, [sessionRatingResults]);

  if (isFetching) {
    return null;
  }

  return (
    <View style={styles.CompletionPage}>
      <Carousel
        itemWidth={windowWidth}
        data={newListWithMetadata}
        Component={CompletionItem}
      />
    </View>
  );
};

export default memo(observer(CompletionPage));

const styles = StyleSheet.create({
  CompletionPage: {
    flex: 1,
    top: verticalScale(-20),
  },
});
