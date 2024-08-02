import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '../AppText/AppText';
import {Button, ButtonTheme} from '../Button/Button';
import {Modal} from '../Modal/Modal';

interface DialogProps {
  confirmText: string;
  onConfirmHandler: () => void;
  title?: string;
  text?: string;
  visible: boolean;
}

export const Dialog = memo((props: DialogProps) => {
  const {confirmText, onConfirmHandler, text, title, visible} = props;
  const colors = useColors();

  return (
    <Modal contentStyle={styles.contentStyle} visible={visible}>
      <>
        <View style={styles.topBlock}>
          {title && (
            <AppText
              style={[styles.title, {color: colors.primaryTextColor}]}
              size={TextSize.LEVEL_5}
              weight={'600'}
              text={title}
            />
          )}
          {text && (
            <AppText
              style={[{color: colors.primaryTextColor}]}
              size={TextSize.LEVEL_3}
              weight={'600'}
              text={text}
            />
          )}
        </View>
        {confirmText && (
          <Button
            style={styles.btn}
            theme={ButtonTheme.GRADIENT}
            onPress={onConfirmHandler}>
            <AppText
              style={{color: colors.bgQuinaryColor}}
              size={TextSize.LEVEL_4}
              weight={'700'}
              text={confirmText}
            />
          </Button>
        )}
      </>
    </Modal>
  );
});

const styles = StyleSheet.create({
  contentStyle: {
    height: 'auto',
  },
  btn: {
    width: horizontalScale(100),
    marginLeft: 'auto',
  },
  topBlock: {
    marginBottom: verticalScale(20),
  },
  title: {
    marginBottom: verticalScale(10),
  },
});
