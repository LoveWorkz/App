import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {InstagramIcon} from '@src/shared/assets/icons/Instagram';
import {LocationIcon} from '@src/shared/assets/icons/Location';
import {PhoneIcon} from '@src/shared/assets/icons/Phone';
import {Wrapper as ContactUsItem} from './ContactUsItem/ContactUsItem';

const itemsData = [
  {
    Icon: PhoneIcon,
    text: '+911-07-849-30-85',
  },
  {
    Icon: InstagramIcon,
    text: 'instagram.com/lovenough',
  },
  {
    Icon: LocationIcon,
    text: 'Berlin, 12/2 Elizabeth st., office 456 ',
  },
];

const ContactUsPage = () => {
  return (
    <View style={styles.contactUs}>
      <View style={styles.itemWrapper}>
        {itemsData.map(item => {
          return <ContactUsItem key={item.text} {...item} />;
        })}
      </View>
    </View>
  );
};

export const Wrapper = memo(ContactUsPage);

const styles = StyleSheet.create({
  contactUs: {
    flex: 1,
  },
  itemWrapper: {},
});
