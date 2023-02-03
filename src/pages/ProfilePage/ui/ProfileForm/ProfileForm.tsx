import React, {memo, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';

import {Input} from '@src/shared/ui/Input/Input';
import {Select} from '@src/shared/ui/Select/Select';

const ProfileForm = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const options = [
    {label: 'lavel 1', value: 'value 1'},
    {label: 'lavel 2', value: 'value 2'},
    {label: 'lavel 3', value: 'value 3'},
    {label: 'lavel 4', value: 'value 4'},
  ];

  return (
    <SafeAreaView style={styles.profileForm}>
      <View style={styles.item}>
        <Input
          label={'Name'}
          value={undefined}
          onChange={() => {}}
          placeholder={'Enter Password'}
        />
      </View>
      <View style={styles.item}>
        <Input
          label={'Age'}
          value={undefined}
          onChange={() => {}}
          placeholder={'Enter Password'}
        />
      </View>
      <View style={styles.item}>
        <Select
          label={'Country'}
          options={options}
          value={selectedLanguage}
          onSelect={value => setSelectedLanguage(value)}
        />
      </View>
      <View style={styles.item}>
        <Select
          label={'Relationship status'}
          options={options}
          value={selectedLanguage}
          onSelect={value => setSelectedLanguage(value)}
        />
      </View>
    </SafeAreaView>
  );
};

export const Wrapper = memo(ProfileForm);

const styles = StyleSheet.create({
  profileForm: {
    width: '100%',
  },
  item: {
    marginBottom: 10,
  },
});
