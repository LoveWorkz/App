import React, {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {Select, SelectTheme} from '@src/shared/ui/Select/Select';
import {getRelationshipStatusItems} from '../../model/lib/myRelationship';
import myRelationshipStore from '../../model/store/myRelationshipStore';

const RelationshipStatusSelect = () => {
  const {t} = useTranslation();

  const relationshipStatusItems = getRelationshipStatusItems(t);

  const relationshipStatus = myRelationshipStore.relationshipStatus;

  const onSelectHandler = useCallback((value: string) => {
    myRelationshipStore.setRelationshipStatus(value);
  }, []);

  return (
    <Select
      Theme={SelectTheme.OUTLINE}
      prompt={t('myRelationship.relationship_status') || ''}
      label={t('myRelationship.status_label') || ''}
      options={relationshipStatusItems}
      value={relationshipStatus}
      onSelect={onSelectHandler}
    />
  );
};

export default memo(observer(RelationshipStatusSelect));
