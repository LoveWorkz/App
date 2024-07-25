import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Modal} from '@src/shared/ui/Modal/Modal';

interface PresSessionModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
}

const PresSessionModal = (props: PresSessionModalProps) => {
  const {visible, setVisible, onConfirm, onCancel} = props;

  const colors = useColors();
  const {t} = useTranslation();

  const onCancelHandler = () => {
    if (onCancel) {
      onCancel();

      return;
    }
    setVisible?.(false);
  };

  const onConfirmHandler = () => {
    onConfirm();
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
        text={t('common.how_are_we_today')}
      />

      <View style={styles.textsBlock}>
        <AppText
          style={styles.mainText}
          size={TextSize.LEVEL_4}
          align={'justify'}
          text={t('common._feedback_text_1')}
        />
        <AppText
          size={TextSize.LEVEL_4}
          align={'justify'}
          text={t('common.put_iphone_not_distracted')}
        />

        <View style={styles.noteBlock}>
          <View style={styles.note}>
            <AppText
              size={TextSize.LEVEL_2}
              weight={'500'}
              text={t('common.note')}
            />
          </View>
          <AppText
            size={TextSize.LEVEL_2}
            weight={'500'}
            align={'justify'}
            text={t('common.alternate_turns_in_questions')}
          />
        </View>
      </View>

      <View style={styles.btnGroup}>
        <Button
          style={styles.skipBtn}
          theme={ButtonTheme.CLEAR}
          onPress={onCancelHandler}>
          <AppText
            style={styles.skipBtnText}
            weight={'600'}
            text={t('common.not_today')}
          />
        </Button>
        <Button
          onPress={onConfirmHandler}
          theme={ButtonTheme.GRADIENT}
          style={styles.letsDoThisBtn}>
          <AppText
            style={{color: colors.bgQuinaryColor}}
            weight={'700'}
            text={t('common.amazing_lets_do_it')}
          />
        </Button>
      </View>
    </Modal>
  );
};

export default memo(PresSessionModal);

const styles = StyleSheet.create({
  content: {
    minHeight: verticalScale(188),
    paddingVertical: verticalScale(40),
  },
  textsBlock: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(40),
  },

  noteBlock: {
    marginTop: verticalScale(20),
  },
  note: {
    marginBottom: verticalScale(10),
  },

  mainText: {
    marginBottom: verticalScale(20),
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  letsDoThisBtn: {
    width: '55%',
  },
  skipBtn: {
    width: '45%',
  },
  skipBtnText: {
    textDecorationLine: 'underline',
  },
});
