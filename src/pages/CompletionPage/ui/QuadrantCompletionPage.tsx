import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {windowWidth} from '@src/app/styles/GlobalStyle';
import {Carousel} from '@src/shared/ui/Carousel/Carousel';
import {verticalScale} from '@src/shared/lib/Metrics';
import {
  getQuadrantsImageUrls,
  QuadrantType,
  sessionStore,
} from '@src/entities/Session';
import {getNextElementById} from '@src/shared/lib/common';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import CompletionItem from './CompletionItem';
import completionPageStore from '../model/store/completionPageStore';

const QuadrantCompletionPage = () => {
  const language = useLanguage();

  const setRating = completionPageStore.setRating;

  const ratingResults = completionPageStore.ratingResults;
  const ratingInformationList = completionPageStore.ratingInformationList;
  const isSending = completionPageStore.isSending;
  const quadrants = sessionStore.quadrants;
  const currentQuadrant = sessionStore.currentQuadrant;
  const description = completionPageStore.description;

  const nextQuadrant = useMemo(() => {
    if (!currentQuadrant) {
      return currentQuadrant;
    }

    return getNextElementById<QuadrantType>({
      id: currentQuadrant.id,
      array: quadrants,
    });
  }, [currentQuadrant, quadrants]);

  useFocusEffect(
    useCallback(() => {
      completionPageStore.init(language);
    }, [language]),
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
          ? getQuadrantsImageUrls()[currentQuadrant.id]
          : item.image,
        isSending,
        isQuadrant: true,
        nextStep: nextQuadrant?.displayName[language],
        description: item.description || description,
      };
    });
  }, [
    ratingResults,
    ratingInformationList,
    isSending,
    currentQuadrant,
    nextQuadrant,
    language,
    description,
  ]);

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
