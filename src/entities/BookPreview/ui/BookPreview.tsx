import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {BookImage} from '@src/entities/Book';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';

interface BookPreviewProps {
  image: BookImage;
  isLoading: boolean;
}

const height = 340;
const width = horizontalScale(242);
const borderRadius = moderateScale(10);

const BookPreview = (props: BookPreviewProps) => {
  const {image, isLoading} = props;
  const {theme} = useTheme();

  const imageFront = image.front;

  const uri = useMemo(() => {
    return {uri: imageFront, priority: FastImage.priority.normal};
  }, [imageFront]);

  if (isLoading) {
    return (
      <View style={[styles.BookPreview]}>
        <Skeleton width={width} height={height} borderRadius={borderRadius} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.BookPreview,
        {...getShadowOpacity(theme).shadowOpacity_level_3},
      ]}>
      <FastImage style={styles.image} resizeMode={'stretch'} source={uri} />
    </View>
  );
};

const styles = StyleSheet.create({
  BookPreview: {
    height: height,
    border: borderRadius,
    width: width,
  },
  image: {
    borderRadius: borderRadius,
    idth: '100%',
    height: '100%',
  },
});

export default memo(BookPreview);
