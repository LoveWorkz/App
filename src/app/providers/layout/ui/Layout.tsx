import React, {ReactElement} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {globalPadding} from '@src/app/styles/GlobalStyle';
import {useColors} from '@src/app/providers/colorsProvider';

interface LayoutProps {
  children: ReactElement;
  isPageScrolling?: boolean;
}

export const Layout = (props: LayoutProps) => {
  const {children, isPageScrolling} = props;
  const colors = useColors();

  if (isPageScrolling) {
    return (
      <ScrollView>
        <View style={[styles.layout, {backgroundColor: colors.bgColor}]}>
          {children}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={[styles.layout, {backgroundColor: colors.bgColor}]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    padding: globalPadding,
    paddingBottom: 0,
    flex: 1,
    justifyContent: 'center',
  },
});
