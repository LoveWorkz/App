import React, {memo, ReactElement} from 'react';
import {ScrollView} from 'react-native';

interface ScrollViewWithoutIndicatorProps {
  children: ReactElement | ReactElement[];
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
}

export const ScrollViewWithoutIndicator = (
  props: ScrollViewWithoutIndicatorProps,
) => {
  const {children, ...rest} = props;

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...rest}>
      {children}
    </ScrollView>
  );
};

export default memo(ScrollViewWithoutIndicator);
