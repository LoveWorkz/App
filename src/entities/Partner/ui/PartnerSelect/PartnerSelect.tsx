import React, {memo, useCallback, useMemo} from 'react';
import {SafeAreaView} from 'react-native';
import {useTranslation} from 'react-i18next';

import {SelectTheme} from '@src/shared/ui/Select/Select';

import {TouchableComponent} from '@src/shared/ui/Select/TouchableComponent';
import {PartnerType} from '../../model/types/partnerTypes';
import partnerStore from '../../model/store/partnerStore';

interface PartnerSelectProps {
  isLoading: boolean;
  partner: PartnerType | null;
}

const PartnerSelect = (props: PartnerSelectProps) => {
  const {isLoading, partner} = props;

  const copiedPartner = useMemo(() => {
    if (!partner) {
      return null;
    }

    return {...partner};
  }, [partner]);

  const {t} = useTranslation();

  const onPressTouchableArea = useCallback(() => {
    partnerStore.openPartnerPage(copiedPartner);
  }, [copiedPartner]);

  return (
    <SafeAreaView>
      <TouchableComponent
        isLoading={isLoading}
        selectedDisplayValue={partner?.name || ''}
        theme={SelectTheme.OUTLINE}
        label={t('profile.partner') || ''}
        onSelectOpenHandler={onPressTouchableArea}
        placeholder={t('profile.add_partner') || ''}
      />
    </SafeAreaView>
  );
};

export default memo(PartnerSelect);
