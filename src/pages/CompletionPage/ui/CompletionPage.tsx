import React, {memo, useCallback, useMemo} from 'react';
import {Dimensions, StatusBar, StyleSheet, View} from 'react-native';
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
import FastImage from 'react-native-fast-image';
import {useTheme} from '@src/app/providers/themeProvider';

type BackgroundProps = {
  backgroundSource?:
    | {
        uri: string;
      }
    | undefined;
};

const CarouselBackground = (_props: BackgroundProps) => {
  const {isDark} = useTheme();
  return isDark ? (
    <View style={styles.backgroundWrapper}>
      <FastImage
        style={styles.backgroundImage}
        resizeMode={'cover'}
        source={require('../../../shared/assets/images/completionImageDark.png')}
      />
    </View>
  ) : (
    <View style={styles.backgroundWrapper}>
      <FastImage
        style={styles.backgroundImage}
        resizeMode={'cover'}
        source={require('../../../shared/assets/images/completionImageLight.png')}
      />
    </View>
  );
};

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
    ratingInformationList,
    ratingResults,
    currentLevel,
    isSending,
    description,
    setRating,
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
        backgroundComponent={<CarouselBackground />}
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
  backgroundWrapper: {
    position: 'absolute',
    top: 0,
    zIndex: -10,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  backgroundImage: {
    height: verticalScale(320),
  },
});
