import React, {useCallback, memo} from 'react';
import {Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {navigation} from '@src/shared/config/navigation/navigation';

interface IconItemProps {
  name: string;
  size: number;
  focused: boolean;
  icon: string;
}

const IconItem = (props: IconItemProps) => {
  const {size, name, focused, icon} = props;

  const onPressHandler = useCallback(() => {
    navigation.navigate(name);
  }, [name]);

  return (
    <Pressable onPress={onPressHandler}>
      <SvgXml
        xml={icon}
        height={size}
        width={size}
        fill={focused ? 'black' : '#DCDCDC'}
      />
    </Pressable>
  );
};

export const ComponentWrapper = memo(IconItem);
