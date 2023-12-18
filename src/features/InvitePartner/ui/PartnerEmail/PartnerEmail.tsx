import {observer} from 'mobx-react-lite';
import React, {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';

import {Input} from '@src/shared/ui/Input/Input';
import invitePartnerStore from '../../model/store/InvitePartnerStore';

const PartnerEmail = () => {
  const {t} = useTranslation();

  const partnerEmail = invitePartnerStore.partnerEmail;
  const invitePartnerFormErrorInfo =
    invitePartnerStore.invitePartnerFormErrorInfo;

  const onPartnerEmailHandler = useCallback((value: string) => {
    invitePartnerStore.setPartnerEmail(value);
  }, []);

  return (
    <Input
      label={t('partner.partner_email_title')}
      value={partnerEmail}
      onChange={onPartnerEmailHandler}
      placeholder={t('partner.enter_partner_email')}
      error={t(invitePartnerFormErrorInfo.emailError)}
    />
  );
};

export default memo(observer(PartnerEmail));
