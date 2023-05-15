import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {SvgXml} from 'react-native-svg';

import {Input} from '@src/shared/ui/Input/Input';
import {SearchIcon} from '@src/shared/assets/icons/Search';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {useTheme} from '@src/app/providers/themeProvider';
import booksStore from '../../model/store/BooksStore';

const BooksSearchBar = () => {
  const {t} = useTranslation();
  const {theme} = useTheme();

  const onSearchHandler = useCallback((searchBooksText: string) => {
    booksStore.setSearchBooksText(searchBooksText);
    booksStore.searchBooks({searchBooksText});
  }, []);

  return (
    <View style={{...getShadowOpacity(theme).shadowOpacity_level_1}}>
      <Input
        value={booksStore.searchBooksText}
        onChange={onSearchHandler}
        placeholder={t('search') || ''}
        StartIcon={() => (
          <SvgXml
            xml={SearchIcon}
            style={styles.searchIcon}
            stroke={'#B6B6BD'}
          />
        )}
        isSpaceAllowed
      />
    </View>
  );
};

export default memo(observer(BooksSearchBar));

const styles = StyleSheet.create({
  searchIcon: {
    width: horizontalScale(14),
    height: verticalScale(14),
  },
});
