import React, {memo, useMemo} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

export enum LoaderSize {
  SMALL = 'small',
  LARGE = 'large',
}

interface LoaderProps {
  style?: Record<string, string | number>;
  size?: LoaderSize;
}

export const Loader = memo((props: LoaderProps) => {
  const {style, size = LoaderSize.SMALL} = props;

  const mode = useMemo(() => {
    return [styles.Loader, style];
  }, [style]);

  return (
    <View style={mode}>
      <ActivityIndicator size={size} />
    </View>
  );
});

const styles = StyleSheet.create({
  Loader: {
    borderRadius: 50,
  },
});
