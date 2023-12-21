import React, {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {Select, SelectTheme} from '@src/shared/ui/Select/Select';
import {getDoYouHaveKidsItems} from '../../model/lib/myRelationship';
import myRelationshipStore from '../../model/store/myRelationshipStore';

const DoYouHaveKidsSelect = () => {
  const {t} = useTranslation();
  const doYouHaveKids = myRelationshipStore.doYouHaveKids;

  const doYouHaveKidsItems = getDoYouHaveKidsItems(t);

  const onSelectHandler = useCallback((value: string) => {
    myRelationshipStore.setDoYouHaveKids(value);
  }, []);

  return (
    <Select
      Theme={SelectTheme.OUTLINE}
      prompt={t('myRelationship.do_you_have_kids') || ''}
      label={t('myRelationship.do_you_have_kids') || ''}
      options={doYouHaveKidsItems}
      value={doYouHaveKids}
      onSelect={onSelectHandler}
    />
  );
};

export default memo(observer(DoYouHaveKidsSelect));
