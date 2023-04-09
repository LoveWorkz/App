import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {
  globalPadding,
  globalStyles,
  windowHeight,
  windowWidth,
} from '@src/app/styles/GlobalStyle';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';

interface BookProps {
  description: string;
}

const Description = (props: BookProps) => {
  const {description} = props;
  const colors = useColors();
  const {t} = useTranslation();

  return (
    <View
      style={[
        styles.description,
        {
          ...globalStyles.strongShadowOpacity,
          height: windowHeight * 0.57,
          width: windowWidth,
          left: -globalPadding,
        },
      ]}>
      <View>
        <AppText
          style={[styles.bottomTitle, {color: colors.primaryTextColor}]}
          text={t('books.description')}
          weight={'500'}
          size={TextSize.LEVEL_7}
        />
        <AppText
          style={[styles.bottomTitle, {color: colors.primaryTextColor}]}
          text={description}
          size={TextSize.LEVEL_4}
        />
      </View>
      <Gradient style={styles.btnWrapper}>
        <Button style={styles.btn} theme={ButtonTheme.CLEAR}>
          <AppText
            weight={'700'}
            style={[styles.btnText]}
            text={'buy now'}
            size={TextSize.LEVEL_4}
          />
        </Button>
      </Gradient>
    </View>
  );
};

export default memo(Description);

const styles = StyleSheet.create({
  description: {
    backgroundColor: 'white',
    position: 'relative',
    top: 50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: 'center',
  },
  bottomTitle: {
    marginBottom: 15,
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 60,
    padding: 5,
    width: '100%',
    borderRadius: 10,
  },
  btn: {
    width: '100%',
  },
  btnText: {
    color: 'white',
  },
});
