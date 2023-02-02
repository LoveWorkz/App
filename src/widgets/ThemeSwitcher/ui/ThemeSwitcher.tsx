import React, {memo, useState} from 'react';
import {StyleSheet, Text, View, Switch} from 'react-native';

const ThemeSwitcher = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <View style={styles.languageSwitcher}>
      <View>
        <Text style={styles.text}>{`${
          isEnabled ? 'Light' : 'Dark'
        } mode`}</Text>
      </View>
      <View>
        <Switch
          style={{transform: [{scaleX: 1.5}, {scaleY: 1.5}]}}
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setIsEnabled}
          value={isEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  languageSwitcher: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export const Wrapper = memo(ThemeSwitcher);
