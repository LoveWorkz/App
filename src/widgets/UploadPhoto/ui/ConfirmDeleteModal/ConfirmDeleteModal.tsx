import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Modal} from '@src/shared/ui/Modal/Modal';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {verticalScale} from '@src/shared/lib/Metrics';

interface UploadModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  deletePhoto: () => void;
  isDeletingPhoto: boolean;
}

const ConfirmDeleteModal = (props: UploadModalProps) => {
  const {visible, setVisible, deletePhoto, isDeletingPhoto} = props;
  const {t} = useTranslation();
  const colors = useColors();

  const onCancelHandler = useCallback(() => {
    setVisible?.(false);
  }, [setVisible]);

  // after deleting photo close modal
  useEffect(() => {
    if (isDeletingPhoto) {
      return;
    }

    onCancelHandler?.();
  }, [isDeletingPhoto, onCancelHandler]);

  const onDeleteHandler = () => {
    deletePhoto?.();
  };

  return (
    <Modal
      contentStyle={styles.content}
      visible={visible}
      onClose={onCancelHandler}>
      <>
        <AppText
          style={{color: colors.primaryTextColor}}
          weight={'600'}
          size={TextSize.LEVEL_6}
          text={`${t('upload.delete_photo')}?`}
        />
        <View style={styles.btnGroup}>
          <Button
            disabled={isDeletingPhoto}
            style={styles.cancelBtn}
            theme={ButtonTheme.OUTLINED_GRADIENT}
            onPress={onCancelHandler}>
            <GradientText
              weight={'700'}
              size={TextSize.LEVEL_4}
              text={t('cancel')}
            />
          </Button>
          <Button
            disabled={isDeletingPhoto}
            theme={ButtonTheme.GRADIENT}
            style={styles.logOutBtn}
            onPress={onDeleteHandler}>
            <AppText
              style={{color: colors.bgQuinaryColor}}
              size={TextSize.LEVEL_4}
              text={t('delete')}
            />
          </Button>
        </View>
      </>
    </Modal>
  );
};

export default memo(ConfirmDeleteModal);

const btnWidth = '45%';

const styles = StyleSheet.create({
  content: {
    minHeight: verticalScale(200),
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  logOutBtn: {
    width: btnWidth,
  },
  cancelBtn: {
    width: btnWidth,
  },
});
