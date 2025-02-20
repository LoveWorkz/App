import {observer} from 'mobx-react-lite';
import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {quotesStore} from '@src/widgets/Quotes';
import {verticalScale} from '@src/shared/lib/Metrics';
import {Notification} from '@src/entities/Notification';

const NotificationsPage = () => {
  const {t} = useTranslation();

  const onNewsHandler = useCallback(() => {}, []);

  const onQuoteHandler = useCallback((visible: boolean) => {
    quotesStore.toggleQuote(visible);
  }, []);

  const onNewsletterHandler = useCallback(() => {}, []);

  const onPromotionsHandler = useCallback(() => {}, []);

  return (
    <View style={styles.NotificationsPage}>
      <Notification
        title={t('notifications.news_more')}
        description={t('notifications.news_more_description')}
        value={false}
        onChange={onNewsHandler}
        disabled
      />
      <Notification
        title={t('notifications.daily_quotes')}
        description={t('notifications.daily_quotes_description')}
        value={quotesStore.quoteInfo.isQuoteVisible}
        onChange={onQuoteHandler}
      />
      <Notification
        title={t('notifications.newsletter')}
        description={t('notifications.newsletter_description')}
        value={false}
        onChange={onNewsletterHandler}
        disabled
      />
      <Notification
        title={t('notifications.promotions')}
        description={t('notifications.promotions_description')}
        value={false}
        onChange={onPromotionsHandler}
        disabled
      />
    </View>
  );
};

export default memo(observer(NotificationsPage));

const styles = StyleSheet.create({
  NotificationsPage: {
    marginTop: verticalScale(20),
    flex: 1,
  },
});
