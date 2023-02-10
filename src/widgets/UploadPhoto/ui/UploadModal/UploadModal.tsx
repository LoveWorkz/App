import React, {memo, useCallback} from 'react';
import {StyleSheet, View, Text, useWindowDimensions} from 'react-native';
import Modal from 'react-native-modal';
import {Asset} from 'react-native-image-picker';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {modalContentStyle} from '@src/app/styles';
import {UploadPhotoType} from '../../model/types/uploadPhoto';
import uploadPhotoStore from '../../model/store/uploadPhotoStore';

interface UploadModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setPhtotData: (photoData: Asset) => void;
  deletePhoto: () => void;
}

const UploadModal = (props: UploadModalProps) => {
  const {visible, setVisible, setPhtotData, deletePhoto} = props;

  const {width} = useWindowDimensions();

  const onPressHandler = async (type: UploadPhotoType) => {
    try {
      let result;
      // onCancelHandler?.();

      if (type === UploadPhotoType.CAMERA) {
        result = await uploadPhotoStore.uploadPhoto(UploadPhotoType.CAMERA);
      } else {
        result = await uploadPhotoStore.uploadPhoto(UploadPhotoType.GALLERY);
      }

      if (result) {
        setPhtotData(result.assets?.[0] as Asset);
      }
      onCancelHandler?.();
    } catch (e) {
      console.log(e);
    }
  };

  const onCancelHandler = useCallback(() => {
    setVisible?.(false);
  }, [setVisible]);

  const onDeleteHandler = () => {
    deletePhoto?.();
    onCancelHandler?.();
  };

  return (
    <View>
      <Modal
        animationInTiming={300}
        animationIn={'slideInUp'}
        onBackdropPress={onCancelHandler}
        isVisible={visible}>
        <View style={styles.overlay}>
          <View style={[styles.content, {width}]}>
            <Text style={styles.title}>Change profile photo</Text>
            <Button
              onPress={() => onPressHandler(UploadPhotoType.CAMERA)}
              theme={ButtonTheme.CLEAR}>
              <Text style={styles.text}>Take photo</Text>
            </Button>
            <Button
              onPress={() => onPressHandler(UploadPhotoType.GALLERY)}
              theme={ButtonTheme.CLEAR}>
              <Text style={styles.text}>Open gallery</Text>
            </Button>
            <Button onPress={onDeleteHandler} theme={ButtonTheme.CLEAR}>
              <Text style={styles.text}>Delete photo</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const Wrapper = memo(UploadModal);

const styles = StyleSheet.create({
  content: {
    ...(modalContentStyle as Record<string, string | number>),
    position: 'absolute',
    bottom: -20,
    left: -20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
  },
});
