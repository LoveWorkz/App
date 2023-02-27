import React, {memo, useCallback, useMemo, useState} from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';

import {Loader} from '../Loader/Loader';

export enum AvatarTheme {
  SMALL = 'small',
  LARGE = 'large',
}

interface AvatarProps {
  theme?: AvatarTheme;
  style?: Record<string, string | number>;
  imageUrl: string;
  borderRadius?: number;
}

export const Avatar = memo((props: AvatarProps) => {
  const {theme = AvatarTheme.SMALL, style, imageUrl, borderRadius = 50} = props;

  const [isLoading, setIsloading] = useState(false);

  const mode = useMemo(() => {
    return [styles.Avatar, style, styles[theme]];
  }, [theme, style]);

  const image = useMemo(() => {
    return {uri: imageUrl};
  }, [imageUrl]);

  const onLoadStartHandler = useCallback(() => {
    setIsloading(true);
  }, []);

  const onLoadEndHandler = useCallback(() => {
    setIsloading(false);
  }, []);

  return (
    <View style={mode}>
      {isLoading && (
        <View style={styles.loader}>
          <Loader />
        </View>
      )}
      {imageUrl && (
        <ImageBackground
          onLoadStart={onLoadStartHandler}
          onLoadEnd={onLoadEndHandler}
          source={image}
          resizeMode="cover"
          borderRadius={borderRadius}
          style={styles.image}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create<Record<string, any>>({
  Avatar: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: {
    height: 40,
    width: 40,
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  large: {
    height: 150,
    width: 150,
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 100,
  },
  loader: {
    position: 'absolute',
  },
});
