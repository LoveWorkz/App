import React, {memo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Asset} from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {Wrapper as UploadModal} from './UploadModal/UploadModal';

interface UploadPhotoProps {
  setPhtotData: (photoData: Asset) => void;
  deletePhoto: () => void;
  style?: Record<string, string | number>;
}

const UploadPhoto = (props: UploadPhotoProps) => {
  const {setPhtotData, deletePhoto, style} = props;
  const {t} = useTranslation();
  const colors = useColors();

  const [visible, setVisible] = useState(false);

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
            style={[styles.plus, {color: colors.bgQuinaryColor}]}
            size={TextSize.LEVEL_4}
            text={'+'}
          />
          <AppText
            style={{color: colors.bgQuinaryColor}}
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
        deletePhoto={deletePhoto}
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
    marginRight: 10,
  },
});

export const Wrapper = memo(UploadPhoto);
