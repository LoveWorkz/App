import React, {memo, useCallback, useMemo} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {Carousel} from '@src/shared/ui/Carousel/Carousel';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {categoryStore, getLevelsFinalImageUrls} from '@src/entities/Category';
import CompletionItem from './CompletionItem';
import completionPageStore from '../model/store/completionPageStore';
import {Button} from '@src/shared/ui/Button/Button';
import {SvgXml} from 'react-native-svg';
import {useColors} from '@src/app/providers/colorsProvider';
import {ArrowLeftIcon} from '@src/shared/assets/icons/ArrowLeft';

const CompletionPage = () => {
  const language = useLanguage();

  const setRating = completionPageStore.setRating;

  const ratingResults = completionPageStore.ratingResults;
  const ratingInformationList = completionPageStore.ratingInformationList;
  const currentLevel = categoryStore.category;
  const isSending = completionPageStore.isSending;
  const description = completionPageStore.description;

  const {goBack} = useNavigation();

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

  const colors = useColors();

  return (
    <View style={styles.CompletionPage}>
      <StatusBar barStyle={'light-content'} />

      <Button style={styles.arrowWrapper} onPress={goBack}>
        <SvgXml fill={colors.white} style={styles.icon} xml={ArrowLeftIcon} />
      </Button>

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
  arrowWrapper: {
    paddingRight: horizontalScale(20),
    position: 'absolute',
    top: 50,
    left: globalPadding,
    zIndex: 1,
  },
  icon: {
    height: verticalScale(15),
    width: horizontalScale(18),
  },
});
