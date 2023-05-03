import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {BookImage} from '@src/entities/Book';

interface BookPreviewProps {
  image: BookImage;
}

const BookPreview = (props: BookPreviewProps) => {
  const {image} = props;
  const imageFront = image.front;

  const uri = useMemo(() => {
    return {uri: imageFront, priority: FastImage.priority.normal};
  }, [imageFront]);

  return (
    <View style={styles.BookPreview}>
      <FastImage style={styles.image} source={uri} />
    </View>
  );
};

const styles = StyleSheet.create({
  BookPreview: {
    height: 350,
    borderRadius: 5,
    width: 220,
  },
  image: {
    borderRadius: 5,
    idth: '100%',
    height: '100%',
  },
});

export default memo(BookPreview);
