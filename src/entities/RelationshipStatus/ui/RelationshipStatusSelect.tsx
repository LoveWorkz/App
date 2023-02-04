import React, {memo, useCallback} from 'react';
import {SafeAreaView} from 'react-native';

import {Select} from '@src/shared/ui/Select/Select';

const options = [
  {label: 'lavel 1', value: 'lavel 1'},
  {label: 'lavel 2', value: 'lavel 2'},
  {label: 'lavel 3', value: 'lavel 3'},
  {label: 'lavel 4', value: 'lavel 4'},
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
      <Select
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
