import React, {memo, useEffect, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';

import {Modal} from '@src/shared/ui/Modal/Modal';
import {
  StandardThemes,
  Theme,
  useTheme,
} from '@src/app/providers/themeProvider';
import {useColors} from '@src/app/providers/colorsProvider';

interface DatePickerModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setSelectedDate: (date: string) => void;
  initialValue?: string;
}

const DatePickerModal = (props: DatePickerModalProps) => {
  const {visible, setVisible, setSelectedDate, initialValue} = props;
  const {theme} = useTheme();
  const colors = useColors();

  const themeMap = useMemo<Record<Theme, StandardThemes>>(() => {
    return {
      [Theme.Dark]: 'dark',
      [Theme.LIGHT]: 'light',
    };
  }, []);

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (initialValue) {
      setDate(new Date(initialValue));
    }
  }, [initialValue]);

  const onCancelHandler = () => {
    setSelectedDate(date.toISOString());
    setVisible?.(false);
  };

  return (
    <Modal
      contentStyle={styles.content}
      visible={visible}
      onClose={onCancelHandler}>
      <DatePicker
        date={date}
        onDateChange={setDate}
        mode="date"
        locale={'en'}
        maximumDate={new Date()}
        androidVariant="iosClone"
        theme={themeMap[theme]}
        fadeToColor={colors.bgColor}
      />
    </Modal>
  );
};

export default memo(DatePickerModal);

const styles = StyleSheet.create({
  content: {
    minHeight: 100,
    padding: 20,
  },
});
