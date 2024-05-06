import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {windowWidth} from '@src/app/styles/GlobalStyle';
import {Carousel} from '@src/shared/ui/Carousel/Carousel';
import {verticalScale} from '@src/shared/lib/Metrics';
import {getQuadrantsFinalImageUrls} from '@src/entities/Session/model/lib/sessionLib';
import {sessionStore} from '@src/entities/Session';
import CompletionItem from './CompletionItem';
import completionPageStore from '../model/store/completionPageStore';

const QuadrantCompletionPage = () => {
  const setRating = completionPageStore.setRating;

  const ratingResults = completionPageStore.ratingResults;
  const ratingInformationList = completionPageStore.ratingInformationList;
  const isSending = completionPageStore.isSending;
  const currentQuadrant = sessionStore.currentQuadrant;

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
        value: ratingResults[item.pagekey],
        image: currentQuadrant
          ? getQuadrantsFinalImageUrls()[currentQuadrant.id]
          : item.image,
        isSending,
        isQuadrant: true,
      };
    });
  }, [ratingResults, ratingInformationList, isSending, currentQuadrant]);

  return (
    <View style={styles.QuadrantCompletionPage}>
      <Carousel
        itemWidth={windowWidth}
        data={newListWithMetadata}
        Component={CompletionItem}
      />
    </View>
  );
};

export default memo(observer(QuadrantCompletionPage));

const styles = StyleSheet.create({
  QuadrantCompletionPage: {
    flex: 1,
    top: verticalScale(-20),
  },
});
