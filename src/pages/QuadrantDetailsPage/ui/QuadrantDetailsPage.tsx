import React, {memo, useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {observer} from 'mobx-react-lite';
import {SvgXml} from 'react-native-svg';

import {useColors} from '@src/app/providers/colorsProvider';
import {isPlatformIos} from '@src/shared/consts/common';
import {
  globalPadding,
  globalStyles,
  windowWidth,
} from '@src/app/styles/GlobalStyle';
import {quadrantBg} from '@src/shared/assets/images';
import {QuadrantType, sessionStore} from '@src/entities/Session';
import {Carousel} from '@src/shared/ui/Carousel/Carousel';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Button} from '@src/shared/ui/Button/Button';
import {ArrowLeftIcon} from '@src/shared/assets/icons/ArrowLeft';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {QUADRANT_DETAILS_CONTENT_TOP} from '../model/lib/QuadrantDetailsPageLib';
import QuadrantDetailsItem from './QuadrantDetailsItem';

interface QuadrantDetailsPageProps {
  route?: {
    params: {
      id: string;
    };
  };
}

const QuadrantDetailsPage = (props: QuadrantDetailsPageProps) => {
  const {route} = props;

  const colors = useColors();
  const language = useLanguage();

  const quadrantId = route?.params?.id;
  const quadrants = sessionStore.quadrants;

  const [currentQuadrant, setCurrentQuadrant] = useState<QuadrantType>(
    quadrants[0],
  );

  const quadrantNumber = useMemo(() => {
    if (!quadrantId) {
      return 0;
    }

    return sessionStore.getQuadrantIndexById(quadrants, quadrantId);
  }, [quadrants, quadrantId]);

  const swipeHandler = useCallback((currentQuadrant: QuadrantType) => {
    setCurrentQuadrant(currentQuadrant);
  }, []);

  const onPressHandler = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.wrapper}>
      <Button style={styles.iconBtn} onPress={onPressHandler}>
        <SvgXml fill={colors.white} style={styles.icon} xml={ArrowLeftIcon} />
      </Button>
      <FastImage
        style={styles.bgImage}
        source={quadrantBg}
        resizeMode="stretch">
        <Carousel
          initialIndex={quadrantNumber}
          onSwipeHandler={swipeHandler}
          itemWidth={windowWidth}
          setAsWidth={false}
          isBottomPagination
          data={quadrants}
          Component={QuadrantDetailsItem}
          paginationStyle={styles.paginationStyle}
          isSmallDotPagination={false}
          paginationColor={colors.white}
        />
      </FastImage>
      <View style={styles.descriptionWrapper}>
        <AppText
          size={TextSize.LEVEL_5}
          weight="500"
          text={currentQuadrant.largeDescription[language]}
        />
      </View>
    </View>
  );
};

export default memo(observer(QuadrantDetailsPage));

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 20,
  },
  bgImage: {
    top: -20,
    height: 800,
    width: windowWidth,
    overflow: 'visible',
    marginBottom: -260,
  },
  descriptionWrapper: {
    paddingHorizontal: globalPadding,
  },
  paginationStyle: {
    alignItems: 'center',
    top: QUADRANT_DETAILS_CONTENT_TOP,
  },

  iconBtn: {
    position: 'absolute',
    left: globalPadding,
    top: verticalScale(isPlatformIos ? 35 : 0),
    ...globalStyles.zIndex_1,
  },
  icon: {
    height: verticalScale(15),
    width: horizontalScale(18),
    marginRight: horizontalScale(15),
  },
});
