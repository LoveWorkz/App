import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';

import {windowHeight} from '@src/app/styles/GlobalStyle';
import {Loader} from '../Loader/Loader';

export enum LoaderSize {
  SMALL = 'small',
  LARGE = 'large',
}

interface LoaderWrapperProps {
  children: ReactElement;
  isLoading: boolean;
}

export const LoaderWrapper = (props: LoaderWrapperProps) => {
  const {children, isLoading} = props;

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <Loader size={LoaderSize.LARGE} />
      </View>
    );
  }
  return <>{children}</>;
};

const styles = StyleSheet.create({
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight / 2,
  },
});
