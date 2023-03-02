import React, {memo, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Asset} from 'react-native-image-picker';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Wrapper as UploadModal} from './UploadModal/UploadModal';

interface UploadPhotoProps {
  setPhtotData: (photoData: Asset) => void;
  deletePhoto: () => void;
}

const UploadPhoto = (props: UploadPhotoProps) => {
  const {setPhtotData, deletePhoto} = props;

  const [visible, setVisible] = useState(false);

  const onPressHandler = () => {
    setVisible(true);
  };

  return (
    <SafeAreaView style={styles.uploadPhoto}>
      <Button
        onPress={onPressHandler}
        style={styles.btn}
        theme={ButtonTheme.OUTLINED}>
        <View style={styles.uploadTextWrapper}>
          <Text style={styles.plus}>+</Text>
          <Text style={styles.text}>Change photo</Text>
        </View>
      </Button>
      <UploadModal
        visible={visible}
        setVisible={setVisible}
        setPhtotData={setPhtotData}
        deletePhoto={deletePhoto}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  uploadPhoto: {
    flexDirection: 'row',
  },
  btn: {
    backgroundColor: 'black',
  },
  uploadTextWrapper: {
    flexDirection: 'row',
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
