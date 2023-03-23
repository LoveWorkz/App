import React, {memo} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {Asset} from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Animation, Modal} from '@src/shared/ui/Modal/Modal';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
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
  const {t} = useTranslation();

  const {width} = useWindowDimensions();

  const onPressHandler = async (type: UploadPhotoType) => {
    try {
      let result;

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

  const onCancelHandler = () => {
    setVisible?.(false);
  };

  const onDeleteHandler = () => {
    deletePhoto?.();
    onCancelHandler?.();
  };

  return (
    <Modal
      onClose={onCancelHandler}
      animationIn={Animation.SLIDEIN_UP}
      visible={visible}
      contentStyle={[styles.content, {width}]}>
      <AppText
        size={TextSize.LEVEL_6}
        weight={'600'}
        text={t('upload.change_profile_photo')}
      />
      <Button
        onPress={() => onPressHandler(UploadPhotoType.CAMERA)}
        theme={ButtonTheme.CLEAR}>
        <AppText size={TextSize.LEVEL_4} text={t('upload.take_photo')} />
      </Button>
      <Button
        onPress={() => onPressHandler(UploadPhotoType.GALLERY)}
        theme={ButtonTheme.CLEAR}>
        <AppText size={TextSize.LEVEL_4} text={t('upload.open_gallery')} />
      </Button>
      <Button onPress={onDeleteHandler} theme={ButtonTheme.CLEAR}>
        <AppText size={TextSize.LEVEL_4} text={t('upload.delete_photo')} />
      </Button>
    </Modal>
  );
};

export const Wrapper = memo(UploadModal);

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
});
