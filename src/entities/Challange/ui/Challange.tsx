import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

interface ChallangeProps {
  text: string;
  active: boolean;
}

const Challange = (props: ChallangeProps) => {
  const {text, active} = props;

  const onPressHandler = useCallback(() => {
    console.log('press');
  }, []);

  const mode = useMemo(() => {
    return [styles.button, active ? styles.active : ''];
  }, [active]);

  return (
    <TouchableOpacity disabled={!active} style={mode} onPress={onPressHandler}>
      <Text style={[styles.text, active ? styles.activeText : '']}>{text}</Text>
    </TouchableOpacity>
  );
};

export const ComponentWrapper = memo(Challange);

const styles = StyleSheet.create<Record<string, any>>({
  button: {
    padding: 10,
    height: 55,
    width: 100,
    backgroundColor: '#EAEAEA',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
  },
  active: {
    backgroundColor: 'black',
  },
  activeText: {
    color: 'white',
  },
});
