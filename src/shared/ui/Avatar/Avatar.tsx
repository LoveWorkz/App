import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  defaultAvatarImage,
  defaultAvatarImageDark,
} from '@src/shared/assets/images';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import Skeleton from '../Skeleton/Skeleton';

type Size = 130 | 170 | 200 | 40;

interface AvatarProps {
  style?: Record<string, string | number>;
  imageUrl: string;
  borderRadius?: number;
  isLoading?: boolean;
  size?: Size;
}

export const Avatar = memo((props: AvatarProps) => {
  const {
    size = 40,
    style,
    imageUrl,
    borderRadius = 50,
    isLoading = false,
  } = props;

  const {theme: appTheme} = useTheme();
  const isDarkMode = appTheme === Theme.Dark;
  const defaultImage = isDarkMode ? defaultAvatarImageDark : defaultAvatarImage;

  const [isSkeleton, setIsSkeleton] = useState(false);

  useEffect(() => {
    setIsSkeleton(isLoading);
  }, [isLoading]);

  const mode = useMemo(() => {
    return [styles.Avatar, style, {width: size, height: size}];
  }, [style, size]);

  const image = useMemo(() => {
    return {uri: imageUrl};
  }, [imageUrl]);

  const onLoadStartHandler = useCallback(() => {
    if (isLoading) {
      return;
    }

    setIsSkeleton(true);
  }, [isLoading]);

  const onLoadEndHandler = useCallback(() => {
    if (isLoading) {
      return;
    }

    setIsSkeleton(false);
  }, [isLoading]);

  return (
    <View style={mode}>
      {isSkeleton && (
        <View style={styles.loader}>
          <Skeleton width={size} height={size} borderRadius={borderRadius} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  loader: {
    position: 'absolute',
    zIndex: 2,
  },
});
