import React, {
  ComponentType,
  memo,
  MemoExoticComponent,
  MutableRefObject,
  useCallback,
  useRef,
  useState,
} from 'react';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {StyleSheet} from 'react-native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {StyleType} from '@src/shared/types/types';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {getDefaultIndexForCarousel} from '@src/shared/lib/common';

type Item = Record<string, any>;
interface FooterProps {
  count: number;
  currentIndex: number;
}

interface HorizontalSlideProps {
  Component: ComponentType<any> | MemoExoticComponent<any>;
  snapDirection?: 'left' | 'right';
  itemStyle?: StyleType;
  onSwipeHandler?: (param: any, itemNumber: number) => void;
  data: Array<Item>;
  defaultElement?: number;
  isSlideEnabled?: boolean;
  onScrollEnd?: (index: number) => void;
  spead?: number;
  itemWidth?: number;
  Footer?: ComponentType<FooterProps>;
  showLength?: number;
  opacityInterval?: number;
}

const AnimatedView = Animated.View;
const animationDuration = 100;

export const HorizontalSlide = memo((props: HorizontalSlideProps) => {
  const {
    Component,
    snapDirection = 'left',
    itemStyle,
    onSwipeHandler,
    data,
    defaultElement,
    isSlideEnabled = true,
    onScrollEnd,
    spead = 50,
    itemWidth = 0,
    showLength,
    opacityInterval,
    Footer,
  } = props;

  const viewCount = 5;
  const defaultIndex = getDefaultIndexForCarousel(defaultElement);

  const previousProgress = useRef(0);

  const carouselRef = useRef() as MutableRefObject<ICarouselInstance>;
  const newSwapIndex = useRef(defaultIndex);
  const swipeStartStatus = useRef(false) as MutableRefObject<boolean>;

  const [currentIndex, setCurrentIndex] = useState(defaultIndex);

  const checkAndSetSwipeDirection = (progress: number, total: number) => {
    const currentIndex2 = Math.round(progress * (total - 1));

    previousProgress.current = currentIndex2;
  };

  const renderItem = useCallback(
    ({item, index}: {item: Item; index: number}) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const animatedStyles = useAnimatedStyle(() => {
        const isCurrent = index === currentIndex;
        const isSecondCard = index === currentIndex + 1;
        const isPreviousCard = index === currentIndex - 1;
        const isThirdCard = index === currentIndex + 2;

        let rotateZ = '0deg';
        let top = 0;
        let left = 0;
        let zIndex = 30;
        let backgroundColor = '#ffffff';

        if (isCurrent) {
          // Styles for the current card
          top = withTiming(0, {duration: animationDuration});
          left = withTiming(0, {duration: animationDuration});
          rotateZ = withTiming('0deg', {duration: animationDuration});
          zIndex = 50;
          backgroundColor = '#ffffff';
        } else if (isPreviousCard) {
          // Styles for the previous card
          rotateZ = withTiming('0deg', {duration: animationDuration});
          left = withTiming(-globalPadding, {duration: animationDuration});
          backgroundColor = '#ffffff';
        } else if (isSecondCard) {
          // styles for the second card
          rotateZ = withTiming('0deg', {duration: animationDuration});
        } else if (isThirdCard) {
          // styles for the third card
          top = withTiming(-25, {duration: animationDuration});
          rotateZ = withTiming('6deg', {duration: animationDuration});
        } else {
          // Styles for all other cards with animation
          top = withTiming(25, {duration: animationDuration});
          left = withTiming(10, {duration: animationDuration});
          rotateZ = withTiming('8deg', {duration: animationDuration});
        }

        return {
          transform: [{rotateZ}],
          top,
          left,
          zIndex,
          backgroundColor,
        };
      }, [currentIndex, index]);

      return (
        <AnimatedView style={styles.wrapper}>
          <AnimatedView
            style={[
              animatedStyles,
              {
                marginBottom: itemWidth ? 0 : 20,
                width: itemWidth ? horizontalScale(itemWidth) : 'auto',
                borderRadius: moderateScale(25),
              },
            ]}>
            <Component {...item} />
          </AnimatedView>
        </AnimatedView>
      );
    },
    [currentIndex, itemWidth, Component],
  );

  const onProgressChange = useCallback(
    (progress: number, total: number) => {
      // Initially, when the user starts swiping, set `swipeStartStatus.current` to true.
      // This ensures that the logic within this block runs only after the user begins interacting with the carousel.
      if (!swipeStartStatus.current) {
        swipeStartStatus.current = true;
        return;
      }

      // Calculate and set current index based on swipe progress
      checkAndSetSwipeDirection(progress, total);

      // Get current index from carousel
      const index = carouselRef.current?.getCurrentIndex();

      // Update component's state if the index has changed
      if (newSwapIndex.current !== index) {
        newSwapIndex.current = index; // Update swap index
        setCurrentIndex(index); // Update current index to trigger re-render

        // Delay handling of swipe to allow for animations or debounce rapid swipes
        let timeoutId: ReturnType<typeof setTimeout>;
        timeoutId = setTimeout(() => {
          // Find data for the newly centered item and call the swipe handler
          const currentElementInfo = data.find((_, i) => i === index);
          if (currentElementInfo) {
            onSwipeHandler?.(currentElementInfo, index + 1); // +1 adjusts for 0-based index
          }

          // Clean up timeout to avoid unwanted side effects
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        }, spead);
      }
    },
    [spead, data, onSwipeHandler], // Dependencies for useCallback
  );

  const nonEmptyData = data.filter(el => el.type !== 'EMPTY_CARD');

  return (
    <>
      <Carousel
        ref={carouselRef}
        onProgressChange={onProgressChange}
        onScrollEnd={e => {
          onScrollEnd?.(e);
        }}
        onScrollBegin={() => {}}
        defaultIndex={defaultIndex}
        style={[itemStyle]}
        enabled={isSlideEnabled}
        width={windowWidth}
        pagingEnabled={true}
        overscrollEnabled={false}
        mode={'horizontal-stack'}
        loop={false}
        data={data}
        modeConfig={{
          showLength: showLength,
          snapDirection,
          stackInterval: 6,
          rotateZDeg: 20,
          opacityInterval: opacityInterval,
        }}
        customConfig={() => ({type: 'positive', viewCount})}
        renderItem={renderItem}
      />
      {Footer && (
        <Footer count={nonEmptyData.length} currentIndex={currentIndex} />
      )}
    </>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: verticalScale(30),
  },
});
