import {t} from 'i18next';
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {ArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

const HomeCategory = () => {
  return (
    <View style={styles.contaier}>
      <View style={styles.textWrapper}>
        <AppText
          size={TextSize.LEVEL_2}
          text={t('home.continue_where_you_left_off')}
        />
        <AppText weight={'700'} text={'0/40'} />
      </View>
      <View style={styles.bottomBlock}>
        <AppText weight={'700'} size={TextSize.LEVEL_5} text={'BASIC'} />
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
