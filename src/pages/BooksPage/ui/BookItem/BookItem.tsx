import React, {memo, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Keyboard,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {cutText} from '@src/shared/lib/common';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import storage from '@react-native-firebase/storage';
import {useTheme} from '@src/app/providers/themeProvider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';

interface BookProps {
  title: string;
  description: string;
  image: string;
  id: string;
  isLoading: boolean;
  imageName?: string;
}

const height = 100;
const borderRadius = moderateScale(5);
const width = horizontalScale(70);

const BookItem = (props: BookProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const {title, description, image, id, isLoading} = props;
  const colors = useColors();
  const {t} = useTranslation();
  const {theme} = useTheme();
  // const url = await storage().ref('images/profile-1.png').getDownloadURL();
  const StandardTextLength = 110;
  const ISDescriptionLarge = description.length > StandardTextLength;

  const onBookPreviewPressHandler = (bookId: string) => {
    // unfocus search input
    Keyboard.dismiss();
    navigation.navigate(AppRouteNames.BOOK_DETAILS, {id: bookId});
  };

  // console.log('REFNAME', `books/${props.imageName}`);

  useEffect(() => {
    const asyncEffect = async () => {
      const url = await storage()
        .ref(`books/${props.imageName}`)
        .getDownloadURL();
      setImageUrl(url);
    };
    asyncEffect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('FIREBASE URL', imageUrl);

  if (isLoading) {
    return (
      <View style={styles.Book}>
        <Skeleton height={height} width={width} borderRadius={borderRadius} />
        <View style={styles.textContent}>
          <View style={styles.titleSkeleton}>
            <Skeleton height={18} width={100} />
          </View>
          <Skeleton height={60} width={220} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.Book}>
      <Pressable
        onPress={() => onBookPreviewPressHandler(id)}
        style={[
          styles.imageWrapper,
          {...getShadowOpacity(theme, colors.bgColor).shadowOpacity_level_2},
        ]}>
        <FastImage
          style={styles.image}
          source={{
            // uri: image,
            uri: imageUrl ?? image,
            priority: FastImage.priority.normal,
          }}
        />
      </Pressable>
      <View style={styles.textContent}>
        <Pressable onPress={() => onBookPreviewPressHandler(id)}>
          <AppText
            style={[styles.title, {color: colors.primaryTextColor}]}
            text={title}
            weight={'600'}
            size={TextSize.LEVEL_4}
          />
        </Pressable>

        <View>
          <Text style={styles.descriptionWrapper}>
            <AppText
              style={{color: colors.secondaryTextColor}}
              text={
                ISDescriptionLarge
                  ? cutText({text: description, textSize: StandardTextLength})
                  : description
              }
              weight={'700'}
              size={TextSize.LEVEL_2}
            />
            <TouchableOpacity onPress={() => onBookPreviewPressHandler(id)}>
              <GradientText
                style={styles.seeMore}
                text={`${t('books.see_more')}...`}
                weight={'700'}
                size={TextSize.LEVEL_2}
              />
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default memo(BookItem);

const styles = StyleSheet.create({
  Book: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: borderRadius,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: borderRadius,
  },
  imageWrapper: {
    height: height,
    width: width,
    borderRadius: borderRadius,
  },
  textContent: {
    width: '80%',
    marginLeft: horizontalScale(20),
  },
  title: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  descriptionWrapper: {
    paddingRight: horizontalScale(20),
  },
  seeMore: {
    position: 'relative',
    left: 3,
    top: 3,
  },

  titleSkeleton: {
    marginBottom: verticalScale(15),
  },
});
