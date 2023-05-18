import React, {memo, useCallback} from 'react';
import {SafeAreaView} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Select, SelectTheme} from '@src/shared/ui/Select/Select';
import {useColors} from '@src/app/providers/colorsProvider';
import {getRelationshipStatusOptions} from '../model/lib/relationshipStatus';

interface RelationshipStatusSelectProps {
  status: string;
  changeStatus: (status: string) => void;
  initialValue?: string;
}

const RelationshipStatusSelect = (props: RelationshipStatusSelectProps) => {
  const {changeStatus, status, initialValue} = props;
  const colors = useColors();
  const {t} = useTranslation();

  const onChangeHandler = useCallback(
    (value: string) => {
      changeStatus?.(value);
    },
    [changeStatus],
  );

  return (
    <SafeAreaView>
      <Select
        selectedValueStyle={{color: colors.primaryTextColor}}
        Theme={SelectTheme.OUTLINE}
        initialValue={initialValue}
        prompt={t('profile.relationship_status') || ''}
        label={t('profile.relationship_status') || ''}
        options={getRelationshipStatusOptions(t)}
        value={status}
        onSelect={onChangeHandler}
      />
    </SafeAreaView>
  );
};

export default memo(RelationshipStatusSelect);
