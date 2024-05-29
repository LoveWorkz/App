import * as React from 'react';
import {FlatList, View} from 'react-native';

import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';

interface HorizontalCarouselProps {
  data: Array<Record<string, any>>;
  Component: React.ComponentType<any> | React.MemoExoticComponent<any>;
}

function HorizontalCarousel(props: HorizontalCarouselProps) {
  const {data, Component} = props;

  return (
    <View style={{marginLeft: -globalPadding, width: windowWidth}}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={data}
        renderItem={({item, index}) => <Component {...item} index={index} />}
      />
    </View>
  );
}

export default HorizontalCarousel;
