import React, {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {Select, SelectTheme} from '@src/shared/ui/Select/Select';
import {getDoYouLiveTogetherItems} from '../../model/lib/myRelationship';
import myRelationshipStore from '../../model/store/myRelationshipStore';

export const DoYouLiveTogetherSelect = () => {
  const {t} = useTranslation();

  const doYouLiveTogetherItems = getDoYouLiveTogetherItems(t);

  const doYouLiveTogether = myRelationshipStore.doYouLiveTogether;

  const onSelectHandler = useCallback((value: string) => {
    myRelationshipStore.setDoYouLiveTogether(value);
  }, []);

  return (
    <Select
      Theme={SelectTheme.OUTLINE}
      prompt={t('myRelationship.do_you_live_together') || ''}
      label={t('myRelationship.do_you_live_together') || ''}
      options={doYouLiveTogetherItems}
      value={doYouLiveTogether}
      onSelect={onSelectHandler}
    />
  );
};

export default memo(observer(DoYouLiveTogetherSelect));
