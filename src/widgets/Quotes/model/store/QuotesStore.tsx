import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';
import i18n from '@src/shared/config/i18next/i18next';

import {QuoeType, userStore} from '@src/entities/User';
import {datediff} from '@src/shared/lib/date';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {BookType} from '@src/entities/Book';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {QuotesModalInfoType} from '../types/quotesType';

class QuotesStore {
  quoteInfo: QuoeType = {
    isQuoteVisible: false,
    quoteCheckingDate: '',
    bookId: '',
  };
  isQuoteModalVisible: boolean = false;
  quotesModalInfo: QuotesModalInfoType = {
    quote: '',
    bookAuthor: '',
    bookName: '',
    bookId: '',
  };

  constructor() {
    makeAutoObservable(this);
  }

  setIsQuoteModalVisible = (visible: boolean) => {
    this.isQuoteModalVisible = visible;
  };

  setIsQuoteInfo = (QuoteInfo: QuoeType) => {
    this.quoteInfo = QuoteInfo;
  };

  toggleQuote = async (visible: boolean) => {
    try {
      crashlytics().log('Toggling quotes.');

      const user = userStore.user;
      if (user) {
        await this.updateQuotesVisible(visible);
        return;
      }

      runInAction(() => {
        this.quoteInfo.isQuoteVisible = visible;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateQuotesVisible = async (visible: boolean) => {
    await userStore.updateUser({
      field: 'quote.isQuoteVisible',
      data: visible,
    });

    runInAction(() => {
      this.quoteInfo.isQuoteVisible = visible;
    });
  };

  checkQuotesShownStatus = (books: BookType[]) => {
    try {
      crashlytics().log('Checking quotes visible status.');

      // return if a user clicked on "don't show again" button
      if (!this.quoteInfo.isQuoteVisible) {
        return;
      }
      if (!this.quoteInfo.quoteCheckingDate) {
        // only works the first time when user enter the system
        this.getAndSetQuotesModalInfo(books);

        this.setIsQuoteModalVisible(true);
        const currentDate = new Date();

        userStore.updateUser({
          field: 'quote.quoteCheckingDate',
          data: currentDate.toJSON(),
        });
      } else {
        const quoteCheckingDate = new Date(this.quoteInfo.quoteCheckingDate);
        const currentDate = new Date();
        const oneDay = 1;

        const diff = datediff(currentDate, quoteCheckingDate);
        // TODO: restore time checking
        // checking last show time
        if (diff >= oneDay) {
          this.getAndSetQuotesModalInfo(books);

          this.setIsQuoteModalVisible(true);
          // seting new date for checking next time
          userStore.updateUser({
            field: 'quote.quoteCheckingDate',
            data: currentDate.toJSON(),
          });
        }
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getAndSetQuotesModalInfo = (books: BookType[]) => {
    try {
      const currentBookId = this.quoteInfo.bookId;
      // console.log('currentBookId', currentBookId);
      if (!currentBookId) {
        // only works the first time

        const firstBook = books[0];
        // console.log('FIRST BOOK', firstBook);
        let currentBook = firstBook;

        if (!firstBook.quotes) {
          currentBook = this.getNextBook({
            books,
            currentBookId: firstBook.id,
          });
        }

        this.setQuotesModalInfo(currentBook);

        const nextBook = this.getNextBook({
          books,
          currentBookId: currentBook.id,
        });

        // set next book id for checking next time
        userStore.updateUser({
          field: 'quote.bookId',
          data: nextBook.id,
        });
      } else {
        const currentBook = books.find(book => book.id === currentBookId);

        if (!currentBook) {
          return;
        }

        // set current book information to display inside modal
        this.setQuotesModalInfo(currentBook);

        const nextBook = this.getNextBook({
          books,
          currentBookId: currentBook.id,
        });

        // set next book id for checking next time
        userStore.updateUser({
          field: 'quote.bookId',
          data: nextBook.id,
        });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setQuotesModalInfo = async (book: BookType) => {
    try {
      const language = i18n.language as LanguageValueType;

      if (!book.quotes) {
        return;
      }

      // const quotesModalInfo = {
      //   quote: book.quote[language],
      //   bookAuthor: book.author,
      //   bookName: book.displayName[language],
      //   bookId: book.id,
      // };

      console.log('TESTING', book.quotes[0]);

      const quotesModalInfo = {
        quote: book.quotes[0][language],
        bookAuthor: book.author,
        bookName: book.displayName[language],
        bookId: book.id,
      };

      runInAction(() => {
        this.quotesModalInfo = quotesModalInfo;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getNextBook = ({
    books,
    currentBookId,
  }: {
    books: BookType[];
    currentBookId: string;
  }): BookType => {
    const currentBookIndex = books.findIndex(book => book.id === currentBookId);

    let nextBookIndex = currentBookIndex + 1;
    const lastBookIndex = books.length;
    const firstBookIndex = 0;
    const isLastBook = nextBookIndex === lastBookIndex;

    if (isLastBook) {
      nextBookIndex = firstBookIndex;
    }

    const nextBook = books[nextBookIndex];

    // looking for the nearest book with quote
    if (!nextBook.quotes) {
      return this.getNextBook({books, currentBookId: nextBook.id});
    }

    return nextBook;
  };
}

export default new QuotesStore();
