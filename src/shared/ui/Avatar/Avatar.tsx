import React, {memo, useMemo} from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';

export enum AvatarTheme {
  SMALL = 'small',
}

interface AvatarProps {
  theme?: AvatarTheme;
  style?: Record<string, string | number>;
  imageUrl: string;
}

export const Avatar = memo((props: AvatarProps) => {
  const {theme = AvatarTheme.SMALL, style, imageUrl} = props;

  const mode = useMemo(() => {
    return [styles.Avatar, style, styles[theme]];
  }, [theme, style]);

  const image = useMemo(() => {
    return {uri: imageUrl};
  }, [imageUrl]);

  return (
    <View style={mode}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        borderRadius={50}
        style={styles.image}
      />
    </View>
  );
});

const styles = StyleSheet.create<Record<string, any>>({
  Avatar: {
    borderRadius: 50,
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
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 50,
  },
});
