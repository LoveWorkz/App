import React, {memo, useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  defaultAvatarImage,
  defaultAvatarImageDark,
} from '@src/shared/assets/images';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';
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
    borderRadius: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: {
    height: horizontalScale(40),
    width: horizontalScale(40),
  },
  image: {
    height: '100%',
    width: '100%',
  },
  large: {
    height: horizontalScale(200),
    width: horizontalScale(200),
    borderRadius: moderateScale(100),
  },
  loader: {
    position: 'absolute',
  },
});
