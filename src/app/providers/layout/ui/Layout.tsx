import React, {ReactElement} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {
  globalPadding,
  tabBarHeight,
  windowHeight,
} from '@src/app/styles/GlobalStyle';
import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';

interface LayoutProps {
  children: ReactElement;
  isPageScrolling?: boolean;
  deleteBottomPadding?: boolean;
  deleteTopPadding?: boolean;
  isTabBar?: boolean;
}

export const Layout = (props: LayoutProps) => {
  const {
    children,
    isPageScrolling,
    deleteBottomPadding,
    deleteTopPadding,
    isTabBar = false,
  } = props;
  const colors = useColors();
  const paddingBottom = verticalScale(isTabBar ? tabBarHeight + 30 : 30);

  if (isPageScrolling) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{height: windowHeight, backgroundColor: colors.bgColor}}>
        <View
          style={[
            styles.layout,
            {
              paddingBottom: deleteBottomPadding ? 0 : paddingBottom,
              marginTop: deleteTopPadding ? 0 : 20,
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
          backgroundColor: colors.bgColor,
          paddingBottom: deleteBottomPadding ? 0 : 40,
          paddingTop: deleteTopPadding ? 0 : 40,
        },
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    padding: globalPadding,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
});
