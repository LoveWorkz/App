import React, {memo, useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {verticalScale} from '@src/shared/lib/Metrics';
import {infoTextType} from '@src/widgets/InformationBlock';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {ArranKennedyBlock} from '@src/shared/ui/ArranKennedyBlock/ArranKennedyBlock';
// import breakPageStore from '@src/pages/BreakPage/model/store/breakPageStore';
import therapistsStore from '@src/pages/PartnersPage/model/therapistsStore';
import RNFadedScrollView from 'rn-faded-scrollview';
import {SafeAreaView} from 'react-native-safe-area-context';

interface ChallengeInfoPopupContentProps {
  text: infoTextType[];
  onBtnPressHandler: () => void;
}

export const ChallengeInfoPopupContent = memo(
  (props: ChallengeInfoPopupContentProps) => {
    const {text = [], onBtnPressHandler} = props;

    useEffect(() => {
      therapistsStore.init();
    }, []);

    const {t} = useTranslation();
    const therapists = therapistsStore.therapists;
    const selectedTherapist = useMemo(() => therapists[0], [therapists]);

    return (
      <>
        <ArranKennedyBlock therapist={selectedTherapist} />
        <SafeAreaView style={{height: 300}}>
          <RNFadedScrollView
            allowEndFade={true}
            fadeSize={20}
            fadeColors={[
              'rgba(255, 255, 255, 0.01)',
              'rgba(255, 255, 255, 0.4)',
              'rgba(255, 255, 255, 0.5)',
            ]}
            style={styles.texts}>
            {text.map((item, i) => {
              return (
                <View key={i.toString()} style={styles.textItem}>
                  <AppText
                    weight={'600'}
                    size={TextSize.LEVEL_2}
                    text={item.text}
                  />
                </View>
              );
            })}
          </RNFadedScrollView>
        </SafeAreaView>

        <Button
          style={styles.btn}
          theme={ButtonTheme.CLEAR}
          onPress={onBtnPressHandler}>
          <AppText
            style={styles.btnText}
            size={TextSize.LEVEL_2}
            weight={'600'}
            text={t('common.ok_i_got_this')}
          />
        </Button>
      </>
    );
  },
);

const styles = StyleSheet.create({
  texts: {
    marginTop: verticalScale(20),
  },
  textItem: {},
  btn: {
    width: '100%',
  },
  btnText: {
    textDecorationLine: 'underline',
  },
});
