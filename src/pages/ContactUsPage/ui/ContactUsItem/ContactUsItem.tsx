import React, {ComponentType, memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';

interface ContactUsItemProps {
  Icon: ComponentType;
  text: string;
}

const ContactUsItem = (props: ContactUsItemProps) => {
  const {Icon, text} = props;
  const colors = useColors();

  return (
    <View style={styles.contactUsItem}>
      <Icon />
      <View style={styles.textWrapper}>
        <AppText
          style={{color: colors.primaryTextColor}}
          weight={'500'}
          size={TextSize.LEVEL_4}
          text={text}
        />
      </View>
    </View>
  );
};

export const Wrapper = memo(ContactUsItem);

const styles = StyleSheet.create({
  contactUsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: verticalScale(20),
  },
  textWrapper: {
    position: 'absolute',
    left: 30,
  },
});
