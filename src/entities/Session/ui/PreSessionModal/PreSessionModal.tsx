import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {Modal} from '@src/shared/ui/Modal/Modal';

interface PresSessionModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  goToQuestions: () => void;
}

const PresSessionModal = (props: PresSessionModalProps) => {
  const {visible, setVisible, goToQuestions} = props;

  const colors = useColors();

  const onCancelHandler = () => {
    setVisible?.(false);
  };

  const onGoToQuestions = () => {
    goToQuestions();
  };

  return (
    <Modal
      contentStyle={styles.content}
      visible={visible}
      onClose={onCancelHandler}>
      <AppText
        style={{color: colors.primaryTextColor}}
        size={TextSize.LEVEL_6}
        weight={'700'}
        text={'Pre-Session Check - in'}
      />

      <View style={styles.textsBlock}>
        <AppText
          style={[
            styles.text,
            styles.mainText,
            {color: colors.primaryTextColor},
          ]}
          size={TextSize.LEVEL_4}
          weight={'400'}
          text={
            'How are we today? From 10 (amazing) to 1 (leave me alone). Everything below 7: please take a break & skip the session to another day.'
          }
        />
        <AppText
          style={[styles.text, {color: colors.primaryTextColor}]}
          size={TextSize.LEVEL_2}
          weight={'400'}
          text={'Ps:  Put your phone in flight mode so you are not distracted.'}
        />
      </View>

      <View style={styles.btnGroup}>
        <Button
          style={styles.skipBtn}
          theme={ButtonTheme.OUTLINED_GRADIENT}
          onPress={onCancelHandler}>
          <GradientText
            size={TextSize.LEVEL_4}
            weight={'700'}
            text={'Skip it'}
          />
        </Button>
        <Button
          onPress={onGoToQuestions}
          theme={ButtonTheme.GRADIENT}
          style={styles.letsDoThisBtn}>
          <AppText
            style={{color: colors.bgQuinaryColor}}
            size={TextSize.LEVEL_4}
            weight={'700'}
            text={'Lets do this'}
          />
        </Button>
      </View>
    </Modal>
  );
};

export default memo(PresSessionModal);

const btnWidth = '45%';

const styles = StyleSheet.create({
  content: {
    minHeight: verticalScale(188),
  },
  textsBlock: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(35),
  },
  text: {
    textAlign: 'justify',
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
    width: btnWidth,
  },
  skipBtn: {
    width: btnWidth,
  },
});
