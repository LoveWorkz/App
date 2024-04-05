import React, {
    memo,
  } from 'react';
  import {StyleSheet, View} from 'react-native';
import { SvgXml } from 'react-native-svg';
  
  import {
    horizontalScale,
    moderateScale,
    verticalScale,
  } from '@src/shared/lib/Metrics';
  import { useColors } from '@src/app/providers/colorsProvider';
import { StarGradientIcon } from '@src/shared/assets/icons/StarGradient';
import { AppText } from '../AppText/AppText';

  interface PaginationDotsProps {
    currentIndex: number, 
    count: number;
    isFirstElement: boolean;
  }

    const Pagination = (props: PaginationDotsProps) => {
      const {count, currentIndex, isFirstElement} = props;
      const activeOpacity = 1; 
      const inactiveOpacity = 0.2; 
      const colors = useColors();

    return (
      <View style={styles.pagination}>
        {
          isFirstElement ?  <AppText
          style={[
          ]}
          weight={'500'}
          text={`${currentIndex + 1}/${count}`}
        /> : 
        <AppText
        style={[
        ]}
        weight={'500'}
        text={`${currentIndex + 1}/${count} - You’re great! Proceed`}
      />
        }
      <View style={styles.dotsWrapper}>
        {Array.from({ length: count }, (_, index) => {
          const opacity = currentIndex === index ? activeOpacity : inactiveOpacity;

          return (
            <View
              key={index}
              style={[
                styles.dot,
                { 
                  backgroundColor: currentIndex === index ? colors.lavenderBlue : colors.primaryTextColor,
                  opacity: opacity
                },
              ]}
            />
          );
        })}
         <SvgXml
          xml={StarGradientIcon}
          style={styles.icon}
        />
      </View>
      </View>
    );
  };
    
  
  export default memo(Pagination);
  
  const styles = StyleSheet.create({
    pagination: {
      alignItems: 'center',
    },
    dotsWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: verticalScale(10), 
    },
    dot: {
      width: moderateScale(17),
      height: moderateScale(4), 
      borderRadius: moderateScale(6),
      marginHorizontal: horizontalScale(4), 
    },
    icon: {
      width: horizontalScale(10),
      height: horizontalScale(10),
      marginHorizontal: horizontalScale(4), 
    }
  });
  