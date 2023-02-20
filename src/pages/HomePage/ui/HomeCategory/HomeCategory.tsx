import {ArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {t} from 'i18next';
import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

const HomeCategory = () => {
  return (
    <View style={styles.contaier}>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>
          {t('home.continue_where_you_left_off')}
        </Text>
        <Text style={styles.count}>0/40</Text>
      </View>
      <View style={styles.bottomBlock}>
        <Text style={styles.status}>BASIC</Text>
        <Button squar style={styles.btn} theme={ButtonTheme.OUTLINED}>
          <SvgXml
            xml={ArrowRightIcon}
            fill={'white'}
            style={styles.arrowIcon}
          />
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contaier: {
    padding: 20,
    height: 113,
    backgroundColor: '#ECEFF1',
    borderColor: '#ECEFF1',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'space-between',
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  count: {
    fontSize: 18,
    fontWeight: '700',
  },
  bottomBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  status: {
    fontSize: 18,
    fontWeight: '700',
  },
  btn: {
    backgroundColor: 'black',
  },
  btnText: {
    color: 'white',
  },
  arrowIcon: {
    height: 15,
    width: 15,
  },
});

export const ComponentWrapper = memo(HomeCategory);
