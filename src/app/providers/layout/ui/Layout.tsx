import React, {ReactElement} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {globalPadding, windowHeight} from '@src/app/styles/GlobalStyle';
import {useColors} from '@src/app/providers/colorsProvider';

interface LayoutProps {
  children: ReactElement;
  isPageScrolling?: boolean;
  deleteBottomPadding?: boolean;
  deleteTopPadding?: boolean;
}

export const Layout = (props: LayoutProps) => {
  const {children, isPageScrolling, deleteBottomPadding, deleteTopPadding} =
    props;
  const colors = useColors();

  if (isPageScrolling) {
    return (
      <ScrollView
        style={{height: windowHeight, backgroundColor: colors.bgColor}}>
        <View
          style={[
            styles.layout,
            {
              paddingBottom: deleteBottomPadding ? 0 : 40,
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
          marginTop: deleteTopPadding ? 0 : 20,
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
  },
});
