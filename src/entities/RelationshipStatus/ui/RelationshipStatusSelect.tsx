import React, {memo, useCallback} from 'react';
import {SafeAreaView} from 'react-native';

import {Select, SelectMode} from '@src/shared/ui/Select/Select';
import {SelectTheme} from '@src/shared/ui/Select/TouchableComponent';

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
      <Select
        Theme={SelectTheme.UNDERLINE}
        initialValue={initialValue}
        prompt={'Status'}
        label={'Relationship status'}
        options={options}
        value={status}
        mode={SelectMode.DIALOG}
        onSelect={onChangeHandler}
      />
    </SafeAreaView>
  );
};

export const Wrapper = memo(RelationshipStatusSelect);
