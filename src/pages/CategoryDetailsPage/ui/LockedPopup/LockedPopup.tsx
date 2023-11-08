import React, {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {useColors} from '@src/app/providers/colorsProvider';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {lockedImage} from '@src/shared/assets/images';

interface LockedPopupProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const LockedPopup = (props: LockedPopupProps) => {
  const {visible, setVisible} = props;

  const {t} = useTranslation();
  const colors = useColors();

  const onCancelHandler = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  return (
    <Modal
      contentStyle={[
        styles.content,
        {backgroundColor: colors.bgForgotPasswordPopupColor},
      ]}
      visible={visible}
      onClose={onCancelHandler}>
      <FastImage style={styles.image} source={lockedImage} />
      <AppText
        style={[styles.title, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_6}
        weight={'600'}
        text={t('categories.lockPopupTitle')}
      />
      <AppText
        style={[styles.text, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        weight={'400'}
        text={t('categories.lockPopupText')}
      />

      <View style={styles.buttonWrapper}>
        <Button onPress={onCancelHandler} theme={ButtonTheme.GRADIENT}>
          <AppText
            style={{color: colors.bgQuinaryColor}}
            size={TextSize.LEVEL_4}
            weight={'700'}
            text={t('ok')}
          />
        </Button>
      </View>
    </Modal>
  );
};

export default memo(LockedPopup);

const styles = StyleSheet.create({
  content: {
    minHeight: verticalScale(310),
  },
  buttonWrapper: {
    marginTop: verticalScale(30),
    width: '100%',
  },
  image: {
    height: verticalScale(80),
    width: horizontalScale(66),
  },
  title: {
    textAlign: 'center',
    marginVertical: verticalScale(20),
  },
  text: {
    textAlign: 'center',
  },
});
