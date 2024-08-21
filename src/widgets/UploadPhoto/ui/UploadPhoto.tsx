import React, {memo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Asset} from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import UploadModal from './UploadModal/UploadModal';
import ConfirmDeleteModal from './ConfirmDeleteModal/ConfirmDeleteModal';
import {useTheme} from '@src/app/providers/themeProvider';

interface UploadPhotoProps {
  setPhtotData: (photoData: Asset) => void;
  deletePhoto: () => void;
  style?: Record<string, string | number>;
  isDeletingPhoto: boolean;
}

const UploadPhoto = (props: UploadPhotoProps) => {
  const {setPhtotData, deletePhoto, style, isDeletingPhoto} = props;
  const {t} = useTranslation();
  const colors = useColors();
  const {isDark} = useTheme();

  const [visible, setVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const onPressHandler = () => {
    setVisible(true);
  };

  return (
    <View style={styles.uploadPhoto}>
      <Button
        onPress={onPressHandler}
        style={[style || {}]}
        theme={ButtonTheme.GRADIENT}>
        <View style={styles.uploadTextWrapper}>
          <AppText
            style={[
              styles.plus,
              {color: isDark ? colors.white : colors.bgQuinaryColor},
            ]}
            size={TextSize.LEVEL_4}
            text={'+'}
          />
          <AppText
            style={{color: isDark ? colors.white : colors.bgQuinaryColor}}
            weight={'500'}
            size={TextSize.LEVEL_4}
            text={t('upload.change_photo')}
          />
        </View>
      </Button>
      <UploadModal
        visible={visible}
        setVisible={setVisible}
        setPhtotData={setPhtotData}
        setConfirmModalVisible={setConfirmModalVisible}
      />
      <ConfirmDeleteModal
        deletePhoto={deletePhoto}
        visible={confirmModalVisible}
        setVisible={setConfirmModalVisible}
        isDeletingPhoto={isDeletingPhoto}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  uploadPhoto: {
    flexDirection: 'row',
  },
  uploadTextWrapper: {
    flexDirection: 'row',
  },
  plus: {
    marginRight: horizontalScale(10),
  },
});

export default memo(UploadPhoto);
