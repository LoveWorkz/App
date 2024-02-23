import React, {memo, useCallback, useState} from 'react';

import {formatDateString} from '@src/shared/lib/date/date';
import {TouchableComponent} from '../Select/TouchableComponent';
import DatePickerModal from './DatePickerModal';

interface CustomDatePickerProps {
  setSelectedDate: (date: string) => void;
  selectedDate: string;
  isLoading: boolean;
  label: string;
  error?: string;
}

export const CustomDatePicker = memo((props: CustomDatePickerProps) => {
  const {setSelectedDate, selectedDate, isLoading, label, error} = props;

  const [visible, setVisible] = useState(false);

  const formattedValue = selectedDate ? formatDateString(selectedDate) : '';

  const onSelectOpenHandler = useCallback(() => {
    setVisible(true);
  }, []);

  return (
    <>
      <TouchableComponent
        isLoading={isLoading}
        selectedDisplayValue={formattedValue}
        label={label}
        onSelectOpenHandler={onSelectOpenHandler}
        error={error}
      />
      <DatePickerModal
        visible={visible}
        setVisible={setVisible}
        setSelectedDate={setSelectedDate}
        initialValue={selectedDate}
      />
    </>
  );
});
