import {verticalScale} from '@src/shared/lib/Metrics';
import React, {memo, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import Pagination from './Pagination';
import SwipeToProceed from './SwipeToProceed';

interface CardFooterProps {
  count: number;
  currentIndex: number;
  isGradient?: boolean;
}

const CardFooter = (props: CardFooterProps) => {
  const {count, currentIndex, isGradient} = props;

  const [hideSwipeIcon, setHideSwipeIcon] = useState(false);
  const hasRenderedOnce = useRef(false);

  useEffect(() => {
    if (hasRenderedOnce.current) {
      // If the component has already been rendered once, we set it to hide forever.
      setHideSwipeIcon(true);
    } else if (currentIndex === 0) {
      // If currentIndex is 0 and the component has not been rendered, it will render.
      // We mark that it has rendered.
      hasRenderedOnce.current = true;
    } else {
      // If currentIndex is not 0 and the component hasn't rendered yet, we set it to hide.
      setHideSwipeIcon(true);
    }
  }, [currentIndex]);

  return (
    <View
      style={[styles.footer, {bottom: verticalScale(hideSwipeIcon ? 80 : 10)}]}>
      <Pagination
        isGradient={isGradient}
        isFirstElement={!hideSwipeIcon}
        currentIndex={currentIndex}
        count={count}
      />
      {!hideSwipeIcon && <SwipeToProceed />}
    </View>
  );
};

export default memo(CardFooter);

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
