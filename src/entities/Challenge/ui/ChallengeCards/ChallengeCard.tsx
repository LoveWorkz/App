import React, {memo, useCallback, useState} from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextLayoutEventData,
  View,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {WebView} from 'react-native-webview';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {getShadowOpacity, globalStyles} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import {HeartsIcon} from '@src/shared/assets/icons/Hearts';
import {CARD_HEIGHT, CARD_WIDTH} from '@src/shared/consts/common';
import {useColors} from '@src/app/providers/colorsProvider';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {DisplayText} from '@src/shared/types/types';
import challengeStore from '../../model/store/challengeStore';

interface ChallengeCardProps {
  title: DisplayText;
  showButton: boolean;
  body: DisplayText;
  specialChallengeId: string;
  isSelectingSpecialChallenge: boolean;
  isChecked: boolean;
}

const ChallengeCard = (props: ChallengeCardProps) => {
  const {
    title,
    showButton,
    body,
    specialChallengeId,
    isSelectingSpecialChallenge,
    isChecked,
  } = props;
  const {theme} = useTheme();
  const colors = useColors();
  const language = useLanguage();

  const [numberOfLines, setNumberOfLines] = useState<number | null>(null);

  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      setNumberOfLines(e.nativeEvent.lines.length);
    },
    [],
  );

  const onPressHandler = () => {
    challengeStore.specialChallengeCardButtonPressHandler(
      specialChallengeId,
      isChecked,
    );
  };

  return (
    <View
      style={[
        styles.ChallengeCard,
        {
          ...getShadowOpacity(theme).shadowOpacity_level_2,
          backgroundColor: colors.white,
        },
      ]}>
      <AppText
        onTextLayout={onTextLayout}
        size={TextSize.LEVEL_6}
        weight={'600'}
        text={title[language]}
        align={numberOfLines === 1 ? 'left' : 'center'}
      />
      <View style={styles.iconWrapper}>
        <SvgXml
          xml={HeartsIcon}
          width={horizontalScale(60)}
          height={horizontalScale(60)}
        />
      </View>
      <WebView
        source={{
          html: `
         <!DOCTYPE html>
         <html>
           <head>
             <meta name="viewport" content="initial-scale=1.0">
             <style>
            body, html {
              -webkit-user-select: none;
              -ms-user-select: none;
              user-select: none;
              margin: 0;
              padding: 0;
              overflow: hidden;
            }
          </style>
           </head>
           <body>
            ${body[language]}
           </body>
         </html>`,
        }}
        style={styles.htmlStyle}
        bounces={false}
        scalesPageToFit={false}
      />
      {showButton && (
        <View style={styles.btnWrapper}>
          <Button
            disabled={isSelectingSpecialChallenge}
            onPress={onPressHandler}
            theme={ButtonTheme.GRADIENT}
            style={styles.btn}>
            <AppText
              style={{color: colors.white}}
              size={TextSize.LEVEL_4}
              weight={'600'}
              text={'We’ve done the challenge'}
            />
          </Button>
        </View>
      )}
    </View>
  );
};

export default memo(ChallengeCard);

const styles = StyleSheet.create({
  ChallengeCard: {
    height: verticalScale(CARD_HEIGHT),
    width: horizontalScale(CARD_WIDTH),
    borderRadius: moderateScale(20),
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(30),
    overflow: 'hidden',
  },
  content: {
    marginTop: verticalScale(20),
  },
  iconWrapper: {
    position: 'absolute',
    bottom: verticalScale(-18),
    left: 0,
    ...globalStyles.zIndex_1,
  },
  btnWrapper: {
    width: horizontalScale(CARD_WIDTH),
    position: 'absolute',
    bottom: verticalScale(20),
    alignItems: 'center',
    ...globalStyles.zIndex_1,
  },
  btn: {
    width: '87%',
  },

  htmlStyle: {
    ...globalStyles.Quicksand_Regular,
  },
});
