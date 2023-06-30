import React, {ReactElement} from 'react';
import {Modal, SafeAreaView, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {ArrowLeftIcon} from '@src/shared/assets/icons/ArrowLeft';
import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {isPlatformIos} from '@src/shared/consts/common';
import {AppText, TextSize} from '../AppText/AppText';
import {Button} from '../Button/Button';

interface PageSelectProps {
  visible: boolean;
  onClose: () => void;
  prompt?: string;
  children: ReactElement;
}

export const PageSelect = (props: PageSelectProps) => {
  const {visible, onClose, prompt, children} = props;

  const colors = useColors();
  const navbarHeaderHeight = verticalScale(isPlatformIos ? 40 : 55);

  if (!visible) {
    return <></>;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}>
      <SafeAreaView
        style={[styles.selectPage, {backgroundColor: colors.bgColor}]}>
        <View
          style={[
            styles.header,
            {
              height: navbarHeaderHeight,
            },
          ]}>
          <Button style={styles.iconWrapper} onPress={onClose}>
            <SvgXml
              fill={colors.primaryTextColor}
              style={styles.arrowLeft}
              xml={ArrowLeftIcon}
            />
          </Button>

          {prompt && (
            <AppText
              style={{color: colors.primaryTextColor}}
              size={TextSize.LEVEL_6}
              text={prompt}
              weight={'500'}
            />
          )}
        </View>
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create<Record<string, any>>({
  content: {
    paddingLeft: horizontalScale(15),
    paddingTop: verticalScale(20),
  },
  selectPage: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: horizontalScale(15),
  },
  iconWrapper: {
    marginRight: horizontalScale(15),
  },
  arrowLeft: {
    height: verticalScale(15),
    width: horizontalScale(18),
  },
});
