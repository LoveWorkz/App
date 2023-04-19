import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {verticalScale} from '@src/shared/lib/Metrics';

interface WowThatWasFastModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const WowThatWasFastModal = (props: WowThatWasFastModalProps) => {
  const {visible, setVisible} = props;
  const colors = useColors();
  const {t} = useTranslation();

  const onCancelHandler = () => {
    setVisible?.(false);
  };

  return (
    <Modal
      contentStyle={styles.content}
      visible={visible}
      onClose={onCancelHandler}>
      <AppText
        style={{color: colors.primaryTextColor}}
        size={TextSize.LEVEL_6}
        weight={'600'}
        text={t('questions.wow_that_was_fast')}
      />

      <AppText
        style={[styles.description, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={t('questions.remember_it_is_not_a_sprint')}
      />

      <Gradient style={styles.btn}>
        <Button onPress={onCancelHandler} theme={ButtonTheme.CLEAR}>
          <AppText
            style={styles.btnText}
            size={TextSize.LEVEL_4}
            text={t('continue')}
          />
        </Button>
      </Gradient>
      <AppText
        style={[styles.dontShowAgaing, {color: colors.primaryTextColor}]}
        weight={'600'}
        size={TextSize.LEVEL_4}
        text={t('dont_show_again')}
      />
    </Modal>
  );
};

export default memo(WowThatWasFastModal);

const styles = StyleSheet.create({
  content: {
    height: verticalScale(298),
  },
  description: {
    marginBottom: verticalScale(40),
    marginTop: verticalScale(20),
    textAlign: 'center',
  },
  btn: {
    width: '100%',
    paddingVertical: verticalScale(8),
  },
  btnText: {
    color: 'white',
  },
  dontShowAgaing: {
    textDecorationLine: 'underline',
    marginTop: verticalScale(10),
  },
});
