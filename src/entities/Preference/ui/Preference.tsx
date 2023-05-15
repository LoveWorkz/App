import React, {memo, useCallback} from 'react';
import {StyleSheet, Pressable} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import CustomCheckBox from '@src/shared/ui/CustomCheckBox/CustomCheckBox';
import {SelectOption} from '@src/shared/types/types';
import {horizontalScale} from '@src/shared/lib/Metrics';

interface PreferencePropss {
  changePreference: (preference: string) => void;
  preference: SelectOption;
  isChecked: boolean;
}

const Preference = memo((props: PreferencePropss) => {
  const {changePreference, preference, isChecked} = props;
  const {value, label} = preference;
  const colors = useColors();

  const onChangeHandler = useCallback(() => {
    changePreference?.(value);
  }, [changePreference, value]);

  return (
    <Pressable style={styles.content} onPress={onChangeHandler}>
      <CustomCheckBox checked={isChecked} onChange={onChangeHandler} />
      <AppText
        style={[styles.name, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={label}
      />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  preferences: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
  },
  name: {
    flexShrink: 1,
    marginLeft: horizontalScale(10),
  },
});

export default memo(Preference);
