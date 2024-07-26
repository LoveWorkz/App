import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {Modal} from '@src/shared/ui/Modal/Modal';
import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import invitePartnerStore from '../model/store/InvitePartnerStore';
import PartnerEmail from './PartnerEmail/PartnerEmail';

interface InvitePartnerModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const InvitePartnerModal = (props: InvitePartnerModalProps) => {
  const {visible, setVisible} = props;
  const {t} = useTranslation();
  const colors = useColors();

  useEffect(() => {
    if (!visible) {
      invitePartnerStore.resetForm();
    }
  }, [visible]);

  const onDontShowAgainHandler = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onSendHandler = () => {
    invitePartnerStore.invitePartner(() => {
      setVisible(false);
    });
  };

  return (
    <Modal
      contentStyle={styles.content}
      visible={visible}
      onClose={onDontShowAgainHandler}>
      <>
        <AppText
          style={{color: colors.primaryTextColor}}
          weight={'600'}
          size={TextSize.LEVEL_6}
          text={`${t('settings.invite_partner')}`}
        />
        <AppText
          style={[styles.description, {color: colors.primaryTextColor}]}
          size={TextSize.LEVEL_4}
          text={t('partner.description')}
        />
        <View style={styles.emailWrapper}>
          <PartnerEmail />
        </View>
        <Button
          theme={ButtonTheme.GRADIENT}
          style={styles.sendBtn}
          onPress={onSendHandler}>
          <AppText
            style={{color: colors.bgQuinaryColor}}
            size={TextSize.LEVEL_4}
            text={t('common.send')}
          />
        </Button>
        {/* <Button
          style={styles.dontShowAgainBtn}
          theme={ButtonTheme.CLEAR}
          onPress={onDontShowAgainHandler}>
          <AppText
            style={styles.dontShowAgainText}
            weight={'700'}
            size={TextSize.LEVEL_4}
            text={t('common.dont_show_again')}
          />
        </Button> */}
      </>
    </Modal>
  );
};

export default memo(InvitePartnerModal);

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
});
