import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';

interface LayoutProps {
  children: ReactElement;
}

export const Layout = (props: LayoutProps) => {
  const {children} = props;

  return <View style={styles.layout}>{children}</View>;
};

const styles = StyleSheet.create({
  layout: {
    padding: 10,
    paddingBottom: 0,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
