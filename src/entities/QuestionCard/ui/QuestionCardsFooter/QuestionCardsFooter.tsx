import React, {memo, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText} from '@src/shared/ui/AppText/AppText';
import Pagination from '@src/shared/ui/HorizontalSlide/Pagination';
import {verticalScale} from '@src/shared/lib/Metrics';
import SwipeToProceed from './SwipeToProceed';
import {useTranslation} from 'react-i18next';

interface QuestionCardsFooterProps {
  count: number;
  currentIndex: number;
  isWhite?: boolean;
}

const QuestionCardsFooter = (props: QuestionCardsFooterProps) => {
  const {count, currentIndex, isWhite} = props;
  const {t} = useTranslation();
  const [hideSwipeIcon, setHideSwipeIcon] = useState(false);
  const hasRenderedOnce = useRef(false);
  const colors = useColors();

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

  const isFirstElement = !hideSwipeIcon;

  return (
    <View style={[styles.footer, {bottom: verticalScale(30)}]}>
      {isFirstElement ? (
        <AppText weight={'600'} text={`${currentIndex + 1}/${count}`} />
      ) : (
        <AppText
          style={{
            color: isWhite ? colors.white : colors.primaryTextColor,
          }}
          weight={'600'}
          text={`${currentIndex + 1}/${count} - ${t(
            'common.youre_great_proceed',
          )}`}
        />
      )}
      <Pagination
        isWhite={isWhite}
        currentIndex={currentIndex}
        count={count}
        withLastIcon
      />
      {isFirstElement && <SwipeToProceed />}
    </View>
  );
};

export default memo(QuestionCardsFooter);

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
