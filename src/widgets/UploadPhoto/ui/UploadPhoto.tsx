import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const UploadPhoto = () => {
  return (
    <View style={styles.uploadPhoto}>
      <Text style={styles.plus}>+</Text>
      <Text style={styles.text}>Change photo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  uploadPhoto: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 120,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  text: {
    color: 'white',
  },
  plus: {
    color: 'white',
    marginRight: 10,
  },
});

export const Wrapper = memo(UploadPhoto);
