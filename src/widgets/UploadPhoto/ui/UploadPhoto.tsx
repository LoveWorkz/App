import React, {memo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Asset} from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Wrapper as UploadModal} from './UploadModal/UploadModal';

interface UploadPhotoProps {
  setPhtotData: (photoData: Asset) => void;
  deletePhoto: () => void;
  style?: Record<string, string | number>;
}

const UploadPhoto = (props: UploadPhotoProps) => {
  const {setPhtotData, deletePhoto, style} = props;
  const {t} = useTranslation();

  const [visible, setVisible] = useState(false);

  const onPressHandler = () => {
    setVisible(true);
  };

  return (
    <View style={styles.uploadPhoto}>
      <Button
        onPress={onPressHandler}
        style={[styles.btn, style || {}]}
        theme={ButtonTheme.OUTLINED}>
        <View style={styles.uploadTextWrapper}>
          <AppText style={styles.plus} size={TextSize.LEVEL_4} text={'+'} />
          <AppText
            style={styles.text}
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
