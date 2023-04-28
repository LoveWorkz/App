import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {SvgXml} from 'react-native-svg';

import {Input} from '@src/shared/ui/Input/Input';
import {SearchIcon} from '@src/shared/assets/icons/Search';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import booksStore from '../../model/store/BooksStore';

const BooksSearchBar = () => {
  const {t} = useTranslation();

  const [value, setValue] = useState('');

  const onSearchHandler = useCallback((bookInfo: string) => {
    setValue(bookInfo);
    booksStore.searchBooks(bookInfo);
  }, []);

  return (
    <View style={styles.BooksSearchBar}>
      <Input
        value={value}
        onChange={onSearchHandler}
        placeholder={t('auth.enter_email') || ''}
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
  BooksSearchBar: {},
  searchIcon: {
    width: horizontalScale(14),
    height: verticalScale(14),
  },
});
