import React, {memo, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {StatusBar, StyleSheet, View} from 'react-native';
import {upperCase} from 'lodash';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import TherapistBlock from './TherapistBlock';
import breakPageStore from '../model/store/breakPageStore';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@src/app/providers/themeProvider';
import {CustomHeader} from '@src/widgets/headers/CustomHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {globalPadding} from '@src/app/styles/GlobalStyle';
import {LogBox} from 'react-native';

// // Ignore log notification by message:
LogBox.ignoreAllLogs();

const BreakPage = () => {
  const colors = useColors();
  const language = useLanguage();
  const isLoading = breakPageStore.isLoading;
  const {t} = useTranslation();
  const {isDark} = useTheme();
  const insets = useSafeAreaInsets();

  const textStyle = useMemo(() => {
    return {color: colors.white};
  }, [colors]);

  const onPressHandler = () => {
    breakPageStore.letsDoThisPressHandler(language);
  };

  const headerText = upperCase(t('common.well_done'));

  return (
    <>
      <CustomHeader
        arrowColor={isDark ? colors.white : colors.white}
        // containerStyle={{borderWidth: 2}}
      />
      <View style={styles.BreakPage}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={colors.backgroundSecondary}
        />

        <View style={styles.topPart}>
          <AppText
            numberOfLines={1}
            weight="900"
            style={textStyle}
            size={headerText.length > 10 ? TextSize.SIZE_32 : TextSize.SIZE_48}
            text={headerText}
          />
          <AppText
            style={[styles.description, textStyle]}
            size={TextSize.LEVEL_4}
            align={'center'}
            weight="500"
            text={t('common.successfully_mastered_questions')}
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: globalPadding,
          }}>
          <View
            style={{
              // borderWidth: 2,
              // borderColor: 'green',
              // flex: 1,
              width: '100%',
            }}>
            <TherapistBlock />
          </View>
        </View>

        <View style={styles.bottomPart}>
          <AppText
            style={textStyle}
            size={TextSize.LEVEL_4}
            align={'center'}
            weight="500"
            text={t('common.master_next')}
          />
          <Button
            disabled={isLoading}
            onPress={onPressHandler}
            theme={isDark ? ButtonTheme.GRADIENT : ButtonTheme.NORMAL}
            style={[styles.btn, isDark ? {} : {backgroundColor: colors.white}]}>
            {isDark ? (
              <AppText
                style={textStyle}
                weight={'600'}
                size={TextSize.LEVEL_4}
                text={t('common.lets_do_this_challenge')}
              />
            ) : (
              <GradientText
                size={TextSize.LEVEL_4}
                weight={'500'}
                text={t('common.lets_do_this_challenge')}
              />
            )}
          </Button>
        </View>
      </View>
    </>
  );
};

export default memo(observer(BreakPage));

const textWidth = '90%';

const styles = StyleSheet.create({
  BreakPage: {
    flex: 1,
    alignItems: 'center',
    marginTop: 0,
  },
  topPart: {
    width: textWidth,
    alignItems: 'center',
    // marginBottom: verticalScale(30),
    // borderWidth: 2,
    // borderColor: 'red',
  },
  description: {
    marginTop: verticalScale(15),
  },
  bottomPart: {
    width: textWidth,
    // position: 'absolute',
    // bottom: verticalScale(0),
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: 'red',
  },
  btn: {
    width: '96%',
    marginTop: verticalScale(20),
  },
});
