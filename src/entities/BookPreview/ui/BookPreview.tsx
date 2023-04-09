import React, {memo, useMemo} from 'react';
import {StyleSheet, View, Image} from 'react-native';

import {BookImage} from '@src/entities/Book';

interface BookPreviewProps {
  image: BookImage;
}

const BookPreview = (props: BookPreviewProps) => {
  const {image} = props;
  const imageFront = image.front;

  const uri = useMemo(() => {
    return {uri: imageFront};
  }, [imageFront]);

  return (
    <View style={styles.BookPreview}>
      <Image style={styles.image} source={uri} />
    </View>
  );
};

const styles = StyleSheet.create({
  BookPreview: {
    height: 180,
    borderRadius: 5,
  },
  image: {
    idth: '100%',
    height: '100%',
  },
});

export default memo(BookPreview);
