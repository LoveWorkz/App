import React, {memo, useCallback, useMemo} from 'react';

import {SelectOption} from '@src/shared/types/types';
import {Radio} from '../Radio/Radio';

interface RenderItemProps {
  item: SelectOption;
  onSelectHandler: (value: string) => void;
  selectedValue: string;
  itemHeight: number;
}

export const RenderItem = memo((props: RenderItemProps) => {
  const {item, onSelectHandler, selectedValue, itemHeight} = props;
  const {value, label} = item;
  const isSelected = value === selectedValue;

  const onChange = useCallback(
    () => onSelectHandler(value),
    [value, onSelectHandler],
  );

  const mode = useMemo(() => {
    return {height: itemHeight};
  }, [itemHeight]);

  return (
    <Radio
      style={mode}
      key={item.label}
      onChange={onChange}
      label={label}
      value={value}
      isSelected={isSelected}
    />
  );
});
