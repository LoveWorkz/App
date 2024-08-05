import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';
import {APPLICATION_NAME} from '@src/app/config/appConfig';
import {useTranslation} from 'react-i18next';

interface GuidedTourStartModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onStart: () => void;
}

const GuidedTourStartModal = (props: GuidedTourStartModalProps) => {
  const {visible, onStart} = props;
  const colors = useColors();
  const {t} = useTranslation();

  return (
    <Modal contentStyle={styles.content} visible={visible}>
      <AppText
        style={styles.title}
        size={TextSize.SIZE_32}
        letterSpacing={1}
        weight={'600'}
        text={`Welcome to ${APPLICATION_NAME}`}
      />
      <View style={styles.btnGroup}>
        <Button
          onPress={onStart}
          theme={ButtonTheme.GRADIENT}
          style={styles.btn}>
          <AppText
            style={{color: colors.bgQuinaryColor}}
            size={TextSize.LEVEL_5}
            weight={'700'}
            text={t('common.start_tour_here')}
          />
        </Button>
      </View>
    </Modal>
  );
};

export default memo(GuidedTourStartModal);

const styles = StyleSheet.create({
  content: {
    minHeight: verticalScale(188),
    paddingVertical: verticalScale(20),
  },
  title: {
    marginBottom: verticalScale(20),
  },
  btnGroup: {
    width: '100%',
  },
  btn: {
    width: '100%',
  },
});
