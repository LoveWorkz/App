import React, {memo, useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {DEFAULT_INFORMATION_POPUP_WIDTH} from '@src/shared/consts/common';
import {infoTextType} from '@src/widgets/InformationBlock';
import {AppText, TextSize} from '../AppText/AppText';
import {Button, ButtonTheme} from '../Button/Button';
import {Modal} from '../Modal/Modal';

interface InformationBlockPopupProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  text: infoTextType[];
  title?: string;
  popupWidth?: number;
}

export const InformationBlockPopup = memo(
  (props: InformationBlockPopupProps) => {
    const {visible, setVisible, text, title, popupWidth} = props;

    const colors = useColors();
    const {t} = useTranslation();

    const onCancelHandler = useCallback(() => {
      setVisible(false);
    }, [setVisible]);

    if (!visible) {
      return null;
    }

    return (
      <Modal visible={visible} onClose={onCancelHandler}>
        <View>
          <View
            style={[
              styles.content,
              {
                width: popupWidth || DEFAULT_INFORMATION_POPUP_WIDTH,
              },
            ]}>
            {title && (
              <AppText weight={'700'} size={TextSize.LEVEL_6} text={title} />
            )}
            <View style={styles.texts}>
              {text.map(item => {
                return (
                  <Text key={item.text} style={styles.textItem}>
                    {item.boldString && (
                      <AppText
                        style={[styles.text, {color: colors.primaryTextColor}]}
                        weight={'bold'}
                        size={TextSize.LEVEL_3}
                        text={item.boldString}
                      />
                    )}
                    <AppText
                      align={'justify'}
                      style={[styles.text, {color: colors.primaryTextColor}]}
                      weight={'400'}
                      size={TextSize.LEVEL_3}
                      text={item.text}
                    />
                  </Text>
                );
              })}
            </View>
            <Button
              style={styles.btn}
              theme={ButtonTheme.GRADIENT}
              onPress={onCancelHandler}>
              <AppText
                style={{color: colors.bgQuinaryColor}}
                size={TextSize.LEVEL_4}
                weight={'700'}
                text={t('ok')}
              />
            </Button>
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  content: {
    paddingHorizontal: horizontalScale(20),
    padding: verticalScale(10),
    alignItems: 'flex-start',
  },
  texts: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  textItem: {
    textAlign: 'justify',
    marginBottom: verticalScale(20),
  },
  text: {
    lineHeight: 17,
    marginVertical: verticalScale(10),
    textAlign: 'justify',
  },
  btn: {
    width: '100%',
    height: verticalScale(40),
  },
});
