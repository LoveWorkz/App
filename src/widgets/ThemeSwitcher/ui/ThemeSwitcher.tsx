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
      <Switch
        style={styles.switcher}
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={setIsEnabled}
        value={isEnabled}
      />
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
  switcher: {
    transform: [{scaleX: 1.2}, {scaleY: 1.2}],
  },
});

export const Wrapper = memo(ThemeSwitcher);
