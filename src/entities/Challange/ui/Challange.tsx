import React, {memo, useCallback} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

import {globalStyles} from '@src/app/styles/GlobalStyle';

interface ChallangeProps {
  image: string;
}

const Challange = (props: ChallangeProps) => {
  const {image} = props;

  const onPressHandler = useCallback(() => {
    console.log('press');
  }, []);

  return (
    <TouchableOpacity
      style={[styles.challange, {...globalStyles.shadowOpacity}]}
      onPress={onPressHandler}>
      <View style={[styles.content]}>
        <Image
          style={styles.image}
          source={{
            uri: image,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export const ComponentWrapper = memo(Challange);

const styles = StyleSheet.create<Record<string, any>>({
  challange: {
    padding: 10,
    height: 60,
    width: 60,
    backgroundColor: 'white',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#F1F3FF',
    height: 50,
    width: 50,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  text: {
    color: 'black',
  },
  active: {
    backgroundColor: 'black',
  },
  activeText: {
    color: 'white',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
});
