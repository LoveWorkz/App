import React, {useCallback, memo, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {navigation} from '@src/shared/lib/navigation/navigation';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';

interface IconItemProps {
  name: string;
  focused: boolean;
  icon: (param: {isGradient: boolean}) => any;
  size: number;
}

const IconItem = (props: IconItemProps) => {
  const {name, focused, icon, size} = props;

  const onPressHandler = useCallback(() => {
    navigation.navigate(name);
  }, [name]);

  const roundStyle = useMemo(() => {
    return [
      styles.round,
      {
        marginBottom: size ? 0 : 5,
      },
    ];
  }, [size]);

  return (
    <Pressable style={styles.iconWrapper} onPress={onPressHandler}>
      {focused && <Gradient style={roundStyle} />}
      {!focused && <View style={roundStyle} />}
      <SvgXml
        xml={icon({isGradient: focused})}
        height={size || 16}
        width={size || 16}
        fill={focused ? 'black' : '#DCDCDC'}
      />
    </Pressable>
  );
};
const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
  },
  round: {
    height: 4,
    width: 4,
    borderRadius: 4,
  },
});

export const ComponentWrapper = memo(IconItem);
