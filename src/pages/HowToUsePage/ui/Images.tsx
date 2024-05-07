import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {verticalScale} from '@src/shared/lib/Metrics';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {imageUrl} from '../lib/howToUse';

const Images = () => {
  const imageSource = useMemo(() => {
    return {uri: imageUrl};
  }, [])

  return (
    <View style={styles.Images}>
      <FastImage
        style={styles.image}
        resizeMode={'cover'}
        source={imageSource}
      />
    </View>
  );
};

export default memo(Images);

const styles = StyleSheet.create({
  Images: {
    flex: 1,
    width: windowWidth,
    height: verticalScale(380),
  },
  image: {
    height: '100%',
    width: '100%',
    left: -globalPadding,
  },
});
