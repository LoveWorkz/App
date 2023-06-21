import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import logoutStore from '../modal/store/logoutStore';

interface LogOutModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const LogOutModal = (props: LogOutModalProps) => {
  const {visible, setVisible} = props;
  const colors = useColors();
  const {t} = useTranslation();

  const actionAfterLogout = () => {
    setVisible(false);
  };

  const onlogoutHandler = () => {
    logoutStore.logout(actionAfterLogout);
  };

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
        text={`${t('auth.logout')}?`}
      />
      <View style={styles.btnGroup}>
        <Button
          disabled={logoutStore.isLoading}
          style={styles.cancelBtn}
          theme={ButtonTheme.OUTLINED_GRADIENT}
          onPress={onCancelHandler}>
          <GradientText
            size={TextSize.LEVEL_4}
            weight={'700'}
            text={t('cancel')}
          />
        </Button>
        <Button
          disabled={logoutStore.isLoading}
          theme={ButtonTheme.GRADIENT}
          style={styles.logOutBtn}
          onPress={onlogoutHandler}>
          <AppText
            style={{color: colors.bgQuinaryColor}}
            size={TextSize.LEVEL_4}
            weight={'700'}
            text={t('auth.logout')}
          />
        </Button>
      </View>
    </Modal>
  );
};

export default memo(observer(LogOutModal));

const btnWidth = '45%';

const styles = StyleSheet.create({
  content: {
    minHeight: verticalScale(188),
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  logOutBtn: {
    width: btnWidth,
  },
  cancelBtn: {
    width: btnWidth,
  },
});
