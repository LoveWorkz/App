import React, {memo, useCallback} from 'react';
import {SafeAreaView} from 'react-native';

import {Select} from '@src/shared/ui/Select/Select';
import {SelectTheme} from '@src/shared/ui/Select/TouchableComponent';
import {useColors} from '@src/app/providers/colorsProvider';
import {useTranslation} from 'react-i18next';

const options = [
  {label: 'status 1', value: 'status 1'},
  {label: 'status 2', value: 'status 2'},
  {label: 'status 3', value: 'status 3'},
  {label: 'status 4', value: 'status 4'},
];

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
        prompt={'Status'}
        label={t('profile.relationship_status') || ''}
        options={options}
        value={status}
        onSelect={onChangeHandler}
      />
    </SafeAreaView>
  );
};

export default memo(RelationshipStatusSelect);
