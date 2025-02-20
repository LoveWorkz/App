import React, {memo, useCallback, useMemo, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
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
import ScrollViewWithoutIndicator from '@src/shared/ui/ScrollViewWithoutIndicator/ScrollViewWithoutIndicator';
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
  const quadrants = sessionStore.quadrants.slice(0, 4);

  const [currentQuadrant, setCurrentQuadrant] = useState<QuadrantType>(
    quadrants[0],
  );

  const quadrantNumber = useMemo(() => {
    if (!quadrantId) {
      return 0;
    }

    return sessionStore.getQuadrantIndexById(quadrants, quadrantId);
  }, [quadrants, quadrantId]);

  const swipeHandler = useCallback((newCurrentQuadrant: QuadrantType) => {
    setCurrentQuadrant(newCurrentQuadrant);
  }, []);

  const onPressHandler = () => {
    navigation.goBack();
  };

  // console.log('CURRENT QUADRANT', currentQuadrant);

  const bottomTextComponent = useMemo(() => {
    return (
      <AppText
        size={TextSize.LEVEL_5}
        weight="500"
        style={styles.bottomText}
        text={currentQuadrant.largeDescription?.[language]}
      />
    );
  }, [currentQuadrant.largeDescription, language]);

  return (
    <View>
      <StatusBar barStyle={'light-content'} backgroundColor={'#695FCB'} />

      <Button style={styles.iconBtn} onPress={onPressHandler}>
        <SvgXml fill={colors.white} style={styles.icon} xml={ArrowLeftIcon} />
      </Button>
      <ScrollViewWithoutIndicator>
        <View style={styles.wrapper}>
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
              // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-shadow
              Component={(props: any) => (
                <QuadrantDetailsItem
                  {...props}
                  bottomTextComponent={bottomTextComponent}
                />
              )}
              paginationStyle={styles.paginationStyle}
              isSmallDotPagination={false}
              paginationColor={colors.white}
            />
          </FastImage>
        </View>
      </ScrollViewWithoutIndicator>
    </View>
  );
};

export default memo(observer(QuadrantDetailsPage));

const styles = StyleSheet.create({
  wrapper: {},
  bgImage: {
    width: windowWidth,
  },
  descriptionWrapper: {
    paddingHorizontal: globalPadding,
  },
  paginationStyle: {
    alignItems: 'center',
    top: 550,
    position: 'absolute',
    width: '100%',
  },

  iconBtn: {
    position: 'absolute',
    left: globalPadding,
    top: verticalScale(isPlatformIos ? 55 : 20),
    ...globalStyles.zIndex_1,
  },
  icon: {
    height: verticalScale(15),
    width: horizontalScale(18),
    marginRight: horizontalScale(15),
  },
  bottomText: {
    width: '100%',
  },
});
