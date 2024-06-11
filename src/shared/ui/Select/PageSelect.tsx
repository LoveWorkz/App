import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {isPlatformIos} from '@src/shared/consts/common';
import {AppText, TextSize} from '../AppText/AppText';
import {Modal} from '../Modal/Modal';

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
      visible={visible}
      contentStyle={[
        styles.modalContentStyle,
        {backgroundColor: colors.bgColor},
      ]}
      theme={'bottom'}
      onClose={() => {
        onClose();
      }}>
      <View style={[styles.selectPage, {backgroundColor: colors.bgColor}]}>
        <View
          style={[
            styles.header,
            {
              height: navbarHeaderHeight,
            },
          ]}>
          {/* <Button style={styles.iconWrapper} onPress={onClose}>
            <SvgXml
              fill={colors.primaryTextColor}
              style={styles.arrowLeft}
              xml={ArrowLeftIcon}
            />
          </Button> */}

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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create<any>({
  selectPage: {
    flex: 1,
    width: '100%',
  },
  content: {
    paddingLeft: horizontalScale(15),
    paddingTop: verticalScale(20),
    maxHeight: verticalScale(400),
  },
  modalContentStyle: {
    alignItems: 'flex-start',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: horizontalScale(15),
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: horizontalScale(15),
  },
  arrowLeft: {
    height: verticalScale(15),
    width: horizontalScale(18),
  },
});
