import React, {memo} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {getArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {
  globalStyles,
  windowWidthMinusPaddings,
} from '@src/app/styles/GlobalStyle';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';

const HomeCategory = () => {
  const {t} = useTranslation();
  const colors = useColors();

  return (
    <View style={{width: windowWidthMinusPaddings}}>
      <AppText
        style={[styles.quickStart, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={t('home.quick_start')}
        weight={'500'}
      />
      <ImageBackground
        style={[styles.contaier, {...globalStyles.shadowOpacity}]}
        source={{
          uri: 'http://localhost:8081/src/shared/assets/images/Mask.png',
        }}>
        <View style={styles.content}>
          <View style={styles.textWrapper}>
            <AppText
              style={{color: colors.primaryTextColor}}
              size={TextSize.LEVEL_2}
              text={t('home.continue_where_you_left_off')}
            />
            <GradientText weight={'700'} text={'0/40'} />
          </View>
          <View style={styles.bottomBlock}>
            <AppText
              style={{color: colors.primaryTextColor}}
              weight={'700'}
              size={TextSize.LEVEL_5}
              text={'BASIC'}
            />
            <Gradient style={styles.btn}>
              <Button theme={ButtonTheme.CLEAR}>
                <SvgXml xml={getArrowRightIcon({})} style={styles.arrowIcon} />
              </Button>
            </Gradient>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  contaier: {
    height: 92,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
  },
  content: {
    padding: 15,
  },
  quickStart: {
    marginBottom: 20,
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBlock: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  status: {
    fontSize: 18,
    fontWeight: '700',
  },
  btn: {
    borderRadius: 10,
  },
  btnText: {
    color: 'white',
  },
  arrowIcon: {
    height: 15,
    width: 15,
    fill: 'white',
  },
});

export const ComponentWrapper = memo(HomeCategory);
