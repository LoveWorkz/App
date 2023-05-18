import React, {memo, useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  defaultAvatarImage,
  defaultAvatarImageDark,
} from '@src/shared/assets/images';
import {Loader} from '../Loader/Loader';
import {Theme, useTheme} from '@src/app/providers/themeProvider';

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

  const {theme: appTheme} = useTheme();
  const isDarkMode = appTheme === Theme.Dark;
  const defaultImage = isDarkMode ? defaultAvatarImageDark : defaultAvatarImage;

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
      <FastImage
        onLoadStart={onLoadStartHandler}
        onLoadEnd={onLoadEndHandler}
        source={imageUrl ? image : defaultImage}
        style={[styles.image, {borderRadius}]}
      />
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
  },
  image: {
    height: '100%',
    width: '100%',
  },
  large: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  loader: {
    position: 'absolute',
  },
});
