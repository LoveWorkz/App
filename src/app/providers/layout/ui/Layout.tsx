import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';

import {globalPadding} from '@src/app/styles/GlobalStyle';

interface LayoutProps {
  children: ReactElement;
}

export const Layout = (props: LayoutProps) => {
  const {children} = props;

  return <View style={styles.layout}>{children}</View>;
};

const styles = StyleSheet.create({
  layout: {
    padding: globalPadding,
    paddingBottom: 0,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
