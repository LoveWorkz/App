import React, {ReactElement, useCallback, useRef} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {
  globalPadding,
  tabBarHeight,
  windowHeight,
} from '@src/app/styles/GlobalStyle';
import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';
import {BgColor} from '@src/shared/config/route/configRoute';

interface LayoutProps {
  children: ReactElement;
  isPageScrolling?: boolean;
  deleteBottomPadding?: boolean;
  deleteTopPadding?: boolean;
  isTabBar?: boolean;
  bgColor?: BgColor;
  deleteGlobalPadding?: boolean;
}

export const Layout = (props: LayoutProps) => {
  const {
    children,
    isPageScrolling,
    deleteBottomPadding,
    deleteTopPadding,
    isTabBar = false,
    bgColor,
    deleteGlobalPadding = false,
  } = props;

  const scrollViewRef = useRef<ScrollView>(null);
  const colors = useColors();
  const paddingBottom = verticalScale(isTabBar ? tabBarHeight + 30 : 30);
  const marginTop = verticalScale(deleteTopPadding ? 0 : 20);

  let backgroundColor;

  switch (bgColor) {
    case 'secondaryBackground':
      backgroundColor = colors.themeSecondaryBackground;
      break;
    case 'white':
      backgroundColor = colors.white;
      break;
    default:
      backgroundColor = colors.bgColor;
  }

  useFocusEffect(
    useCallback(() => {
      scrollViewRef?.current?.scrollTo({y: 0, animated: false});
    }, []),
  );

  if (isPageScrolling) {
    return (
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{height: windowHeight, backgroundColor}}>
        <View
          style={[
            styles.layout,
            {
              paddingBottom: deleteBottomPadding ? 0 : paddingBottom,
              marginTop,
              padding: deleteGlobalPadding ? 0 : globalPadding,
            },
          ]}>
          {children}
        </View>
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.layout,
        {
          backgroundColor,
          paddingBottom: deleteBottomPadding ? 0 : paddingBottom,
          paddingTop: marginTop,
          padding: deleteGlobalPadding ? 0 : globalPadding,
        },
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
});
