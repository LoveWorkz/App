import React, {memo, useCallback} from 'react';
import {SafeAreaView} from 'react-native';

import {
  CustomSelect,
  SelectTheme,
} from '@src/shared/ui/CustomSelect/CustomSelect';

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

  const onChangeHandler = useCallback(
    (value: string) => {
      changeStatus?.(value);
    },
    [changeStatus],
  );

  return (
    <SafeAreaView>
      <CustomSelect
        Theme={SelectTheme.UNDERLINE}
        initialValue={initialValue}
        prompt={'Status'}
        label={'Relationship status'}
        options={options}
        value={status}
        onSelect={onChangeHandler}
      />
    </SafeAreaView>
  );
};

export const Wrapper = memo(RelationshipStatusSelect);
