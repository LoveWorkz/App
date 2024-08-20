import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  defaultAvatarImage,
  defaultAvatarImageDark,
} from '@src/shared/assets/images';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import Skeleton from '../Skeleton/Skeleton';

type Size = 130 | 170 | 200 | 40 | 60;

const getImage = (
  defaultImage: number,
  imageNumber?: number,
  imageUrl?: string,
) => {
  if (imageUrl) {
    return {uri: imageUrl};
  }

  if (imageNumber) {
    return imageNumber;
  }

  return defaultImage;
};

interface AvatarProps {
  style?: Record<string, string | number>;
  imageUrl?: string;
  imageNumber?: number;
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
    imageNumber,
  } = props;

  const {theme: appTheme} = useTheme();
  const [isSkeleton, setIsSkeleton] = useState(false);

  const isDarkMode = appTheme === Theme.Dark;
  const defaultImage = isDarkMode ? defaultAvatarImageDark : defaultAvatarImage;

  useEffect(() => {
    setIsSkeleton(isLoading);
  }, [isLoading]);

  const mode = useMemo(() => {
    return [styles.Avatar, style, {width: size, height: size}];
  }, [style, size]);

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
        source={getImage(defaultImage, imageNumber, imageUrl)}
        style={[styles.image, {borderRadius}]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
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
