import React, {memo} from 'react';
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
import {useTheme} from '@src/app/providers/themeProvider';

interface BookProps {
  title: string;
  description: string;
  image: string;
  id: string;
}

const BookItem = (props: BookProps) => {
  const {title, description, image, id} = props;
  const colors = useColors();
  const {t} = useTranslation();
  const {theme} = useTheme();

  const StandardTextLength = 110;
  const ISDescriptionLarge = description.length > StandardTextLength;

  const onBookPreviewPressHandler = (bookId: string) => {
    // unfocus search input
    Keyboard.dismiss();
    navigation.navigate(AppRouteNames.BOOK_DETAILS, {id: bookId});
  };

  return (
    <View style={styles.Book}>
      <Pressable
        onPress={() => onBookPreviewPressHandler(id)}
        style={[
          styles.imageWrapper,
          {...getShadowOpacity(theme).shadowOpacity_level_2},
        ]}>
        <FastImage
          style={styles.image}
          source={{
            uri: image,
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

export const Wrapper = memo(BookItem);

const styles = StyleSheet.create({
  Book: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
  },
  imageWrapper: {
    height: 100,
    width: 70,
    borderRadius: 5,
  },
  textContent: {
    width: '80%',
    marginLeft: 20,
  },
  title: {
    marginTop: 10,
    marginBottom: 10,
  },
  descriptionWrapper: {
    paddingRight: 20,
  },
  seeMore: {
    position: 'relative',
    left: 3,
    top: 3,
  },
});
