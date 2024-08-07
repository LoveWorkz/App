import React, {memo, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {useColors} from '@src/app/providers/colorsProvider';
import {BookType} from '@src/entities/Book/model/types';
import firebaseStorage from '@react-native-firebase/storage';

interface BookPreviewProps extends BookType {
  isLoading: boolean;
}

const height = 340;
const width = horizontalScale(242);
const borderRadius = moderateScale(10);

const BookPreview = (props: BookPreviewProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const {isLoading} = props;
  const {theme} = useTheme();
  const colors = useColors();

  // props.

  useEffect(() => {
    const asyncEffect = async () => {
      const url = await firebaseStorage()
        .ref(`books/${props.storage.front_file_name}`)
        .getDownloadURL();
      setImageUrl(url);
    };
    asyncEffect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('BOOK PREVIEW URL', imageUrl);

  // const imageFront = image.front;

  const uri = useMemo(() => {
    // return {uri: imageFront, priority: FastImage.priority.normal};
    return {uri: imageUrl, priority: FastImage.priority.normal};
  }, [imageUrl]);

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
        {...getShadowOpacity(theme, colors.bgColor).shadowOpacity_level_3},
      ]}>
      <FastImage style={styles.image} resizeMode={'stretch'} source={uri} />
    </View>
  );
};

const styles = StyleSheet.create({
  BookPreview: {
    height: height,
    borderRadius: borderRadius,
    width: width,
  },
  image: {
    borderRadius: borderRadius,
    width: '100%',
    height: '100%',
  },
});

export default memo(BookPreview);
