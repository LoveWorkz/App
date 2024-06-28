import React, {memo, useCallback, useMemo} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {windowWidth} from '@src/app/styles/GlobalStyle';
import {Carousel} from '@src/shared/ui/Carousel/Carousel';
import {verticalScale} from '@src/shared/lib/Metrics';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {categoryStore, getLevelsFinalImageUrls} from '@src/entities/Category';
import CompletionItem from './CompletionItem';
import completionPageStore from '../model/store/completionPageStore';

const CompletionPage = () => {
  const language = useLanguage();

  const setRating = completionPageStore.setRating;

  const ratingResults = completionPageStore.ratingResults;
  const ratingInformationList = completionPageStore.ratingInformationList;
  const currentLevel = categoryStore.category;
  const isSending = completionPageStore.isSending;
  const description = completionPageStore.description;

  useFocusEffect(
    useCallback(() => {
      console.log('init complete page', language);
      
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
        image: currentLevel
          ? getLevelsFinalImageUrls()[currentLevel.name]
          : item.image,
        isSending,
        description: item.description || description,
      };
    });
  }, [
    ratingResults,
    ratingInformationList,
    currentLevel,
    isSending,
    description,
  ]);

  return (
    <View style={styles.CompletionPage}>
      <StatusBar barStyle={'light-content'} />

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
