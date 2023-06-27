import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  defaultAvatarImage,
  defaultAvatarImageDark,
} from '@src/shared/assets/images';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';
import Skeleton from '../Skeleton/Skeleton';

export enum AvatarTheme {
  SMALL = 'small',
  LARGE = 'large',
}

interface AvatarProps {
  theme?: AvatarTheme;
  style?: Record<string, string | number>;
  imageUrl: string;
  borderRadius?: number;
  isLoading?: boolean;
}

const smallWidth = horizontalScale(40);
const largeWidth = horizontalScale(200);
const smallBorderRadius = moderateScale(50);
const largeBorderRadius = moderateScale(100);

export const Avatar = memo((props: AvatarProps) => {
  const {
    theme = AvatarTheme.SMALL,
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
    return [styles.Avatar, style, styles[theme]];
  }, [theme, style]);

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
          {AvatarTheme.SMALL === theme ? (
            <Skeleton
              width={smallWidth}
              height={smallWidth}
              borderRadius={smallBorderRadius}
            />
          ) : (
            <Skeleton
              width={largeWidth + 1}
              height={largeWidth + 1}
              borderRadius={largeBorderRadius}
            />
          )}
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
    borderRadius: smallBorderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: {
    height: smallWidth,
    width: smallWidth,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  large: {
    height: largeWidth,
    width: largeWidth,
    borderRadius: largeBorderRadius,
  },
  loader: {
    position: 'absolute',
    zIndex: 2,
  },
});
