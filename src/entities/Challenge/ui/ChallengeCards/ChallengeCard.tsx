import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextLayoutEventData,
  View,
} from 'react-native';
import {SvgUri, SvgXml} from 'react-native-svg';
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
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {APPLICATION_NAME} from '@src/app/config/appConfig';
import challengeStore from '../../model/store/challengeStore';

import storage from '@react-native-firebase/storage';

interface ChallengeCardProps {
  title: DisplayText;
  showButton: boolean;
  body: DisplayText;
  specialChallengeId: string;
  isSelectingChallenge: boolean;
  isChecked: boolean;
}

const ChallengeCard = (props: ChallengeCardProps) => {
  const {
    title,
    showButton,
    body,
    specialChallengeId,
    isSelectingChallenge,
    isChecked,
  } = props;
  const {theme} = useTheme();
  const colors = useColors();
  const language = useLanguage();
  const [svgUrl, setSvgUrl] = useState<string>();

  const [numberOfLines, setNumberOfLines] = useState<number | null>(null);

  // const reference = storage().ref('/challenges_svg/Steps.svg');

  useEffect(() => {
    const asyncEffect = async () => {
      const url = await storage()
        .ref('/challenges_svg/bzrfeed.svg')
        .getDownloadURL();
      setSvgUrl(url);
      console.log(url);
    };
    asyncEffect();
  }, []);

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
          ...getShadowOpacity(theme, colors.bgColor).shadowOpacity_level_2,
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
      {svgUrl && <SvgUri width="50%" height="50%" uri={svgUrl} />}
      {/* <WebView
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
      /> */}
      <View style={styles.appNameWrapper}>
        <GradientText
          size={TextSize.LEVEL_2}
          weight={'700'}
          text={`...${APPLICATION_NAME}`}
        />
      </View>
      {showButton && (
        <View style={styles.btnWrapper}>
          <Button
            disabled={isSelectingChallenge}
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

const paddingHorizontal = horizontalScale(20);

const styles = StyleSheet.create({
  ChallengeCard: {
    height: verticalScale(CARD_HEIGHT),
    width: horizontalScale(CARD_WIDTH),
    borderRadius: moderateScale(20),
    paddingHorizontal,
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
    bottom: verticalScale(45),
    alignItems: 'center',
    ...globalStyles.zIndex_1,
  },
  btn: {
    width: '87%',
  },

  htmlStyle: {
    ...globalStyles.Quicksand_Regular,
  },
  appNameWrapper: {
    position: 'absolute',
    bottom: paddingHorizontal,
    right: paddingHorizontal,
  },
});
