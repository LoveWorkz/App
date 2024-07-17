import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {SvgXml} from 'react-native-svg';
import {CategoryLockedIcon} from '@src/shared/assets/icons/Lock';

interface CategoryBlockedModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const CategoryBlockedModal = (props: CategoryBlockedModalProps) => {
  const {visible, setVisible} = props;
  const {t} = useTranslation();
  const colors = useColors();

  const onDontShowAgainHandler = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  return (
    <Modal
      contentStyle={styles.content}
      visible={visible}
      onClose={onDontShowAgainHandler}>
      <>
        <View style={styles.lockIcon}>
          <SvgXml
            fill={colors.primaryTextColor}
            xml={CategoryLockedIcon}
            width={horizontalScale(50)}
            height={horizontalScale(50)}
          />
        </View>
        <AppText
          style={{
            color: colors.primaryTextColor,
            marginBottom: verticalScale(20),
          }}
          weight={'600'}
          size={TextSize.LEVEL_6}
          text={`${t('categories.lockPopupTitle')}`}
        />
        <AppText
          style={[styles.description, {color: colors.primaryTextColor}]}
          size={TextSize.LEVEL_4}
          text={t('categories.lockPopupText')}
        />
        <Button
          style={styles.btn}
          theme={ButtonTheme.CLEAR}
          onPress={() => setVisible(false)}>
          <AppText
            style={styles.btnText}
            size={TextSize.LEVEL_4}
            weight={'600'}
            text={t('Ok. I’ve got this')}
          />
        </Button>
      </>
    </Modal>
  );
};

export default memo(CategoryBlockedModal);

const styles = StyleSheet.create({
  content: {
    minHeight: verticalScale(280),
  },
  description: {
    textAlign: 'center',
    marginTop: verticalScale(5),
  },
  emailWrapper: {
    width: '100%',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(40),
  },
  sendBtn: {
    width: '100%',
  },
  dontShowAgainBtn: {
    paddingHorizontal: horizontalScale(20),
    marginTop: verticalScale(8),
  },
  dontShowAgainText: {
    textDecorationLine: 'underline',
  },
  lockIcon: {
    marginBottom: verticalScale(20),
  },
  btnText: {
    textDecorationLine: 'underline',
  },
  btn: {
    width: '100%',
  },
});
