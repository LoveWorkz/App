import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {BookImage} from '@src/entities/Book';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';

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
      <FastImage style={styles.image} resizeMode={'stretch'} source={uri} />
    </View>
  );
};

const styles = StyleSheet.create({
  BookPreview: {
    height: verticalScale(340),
    borderRadius: moderateScale(10),
    width: horizontalScale(230),
  },
  image: {
    borderRadius: moderateScale(10),
    idth: '100%',
    height: '100%',
  },
});

export default memo(BookPreview);
