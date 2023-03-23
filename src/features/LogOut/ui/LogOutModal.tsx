import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import logoutStore from '../modal/store/logoutStore';

interface LogOutModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const LogOutModal = (props: LogOutModalProps) => {
  const {visible, setVisible} = props;
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
    <Modal visible={visible} onClose={onCancelHandler}>
      <AppText size={TextSize.LEVEL_6} weight={'600'} text={t('auth.logout')} />
      <View style={styles.btnGroup}>
        <Button
          disabled={logoutStore.isLoading}
          style={styles.cancelBtn}
          theme={ButtonTheme.OUTLINED}
          onPress={onCancelHandler}>
          <AppText size={TextSize.LEVEL_4} weight={'700'} text={t('cancel')} />
        </Button>
        <Button
          disabled={logoutStore.isLoading}
          theme={ButtonTheme.OUTLINED}
          style={styles.logOutBtn}
          onPress={onlogoutHandler}>
          <AppText
            style={styles.logOut}
            size={TextSize.LEVEL_4}
            weight={'700'}
            text={t('auth.logout')}
          />
        </Button>
      </View>
    </Modal>
  );
};

export const Wrapper = memo(observer(LogOutModal));

const btnWidth = '40%';

const styles = StyleSheet.create({
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  logOutBtn: {
    backgroundColor: 'black',
    width: btnWidth,
  },
  cancelBtn: {
    width: btnWidth,
  },
  logOut: {
    color: 'white',
  },
});
