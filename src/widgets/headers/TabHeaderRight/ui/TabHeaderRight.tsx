import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {SettingsIcon} from '@src/shared/assets/icons/Settings';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import InformationBlock from '@src/shared/ui/InformationBlock/InformationBlock';
import {getInformationBlockContent} from '@src/widgets/InformationBlock';
import {TabName} from '@src/shared/types/types';
import {InformationBlockPopup} from '@src/shared/ui/InformationBlock/InformationBlockPopup';

interface TabHeaderRightProps {
  tabName: TabName;
}

const TabHeaderRight = (props: TabHeaderRightProps) => {
  const {tabName} = props;

  const colors = useColors();

  const hideInfoPopup = tabName === 'Home';

  const onSettingsPressHandler = () => {
    navigation.navigate(AppRouteNames.SETTINGS);
  };

  const informationBlockContent = getInformationBlockContent(tabName);

  return (
    <>
      {hideInfoPopup ? (
        <Pressable
          onPress={onSettingsPressHandler}
          style={styles.TabHeaderRight}>
          <SvgXml
            xml={SettingsIcon}
            style={styles.icon}
            stroke={colors.primaryTextColor}
          />
        </Pressable>
      ) : (
        <View style={styles.TabHeaderRight}>
          <InformationBlock
            popupWidth={horizontalScale(320)}
            text={informationBlockContent.text}
            title={informationBlockContent.title}
            Popup={InformationBlockPopup}
          />
        </View>
      )}
    </>
  );
};

export default memo(TabHeaderRight);

const styles = StyleSheet.create({
  TabHeaderRight: {
    justifyContent: 'center',
    marginRight: horizontalScale(20),
  },
  icon: {
    height: verticalScale(24),
    width: verticalScale(24),
  },
});
