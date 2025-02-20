import React, {memo, useCallback} from 'react';
import {Asset} from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {UploadPhotoType} from '../../model/types/uploadPhoto';
import uploadPhotoStore from '../../model/store/uploadPhotoStore';

interface UploadModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setPhtotData: (photoData: Asset) => void;
  setConfirmModalVisible: (visible: boolean) => void;
}

const UploadModal = (props: UploadModalProps) => {
  const {visible, setVisible, setPhtotData, setConfirmModalVisible} = props;
  const {t} = useTranslation();
  const colors = useColors();

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

  const onCancelHandler = useCallback(() => {
    setVisible?.(false);
  }, [setVisible]);

  const onDeleteHandler = () => {
    setVisible(false);
    setConfirmModalVisible(true);
  };

  return (
    <Modal onClose={onCancelHandler} theme={'bottom'} visible={visible}>
      <AppText
        style={{color: colors.primaryTextColor}}
        size={TextSize.LEVEL_6}
        weight={'600'}
        text={t('upload.change_profile_photo')}
      />
      <Button
        onPress={() => onPressHandler(UploadPhotoType.CAMERA)}
        theme={ButtonTheme.CLEAR}>
        <AppText
          style={{color: colors.primaryTextColor}}
          size={TextSize.LEVEL_4}
          text={t('upload.take_photo')}
        />
      </Button>
      <Button
        onPress={() => onPressHandler(UploadPhotoType.GALLERY)}
        theme={ButtonTheme.CLEAR}>
        <AppText
          style={{color: colors.primaryTextColor}}
          size={TextSize.LEVEL_4}
          text={t('upload.open_gallery')}
        />
      </Button>
      <Button onPress={onDeleteHandler} theme={ButtonTheme.CLEAR}>
        <AppText
          style={{color: colors.primaryTextColor}}
          size={TextSize.LEVEL_4}
          text={t('upload.delete_photo')}
        />
      </Button>
    </Modal>
  );
};

export default memo(UploadModal);
