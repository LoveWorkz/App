import {makeAutoObservable, runInAction} from 'mobx';

import {QuoeType, userStore} from '@src/entities/User';
import {datediff} from '@src/shared/lib/date';
import {BookType} from '@src/entities/Book';
import {QuotesModalInfoType} from '../types/quotesType';

class QuotesStore {
  quoteInfo: QuoeType = {
    isQuoteVisible: true,
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
    try {
      runInAction(() => {
        this.isQuoteModalVisible = visible;
      });
    } catch (e) {
      console.log(e);
    }
  };

  setIsQuoteInfo = (QuoteInfo: QuoeType) => {
    try {
      runInAction(() => {
        this.quoteInfo = QuoteInfo;
      });
    } catch (e) {
      console.log(e);
    }
  };

  toggleQuote = async (visible: boolean) => {
    try {
      await userStore.updateUser({
        field: 'quote.isQuoteVisible',
        data: visible,
      });
      runInAction(() => {
        this.quoteInfo.isQuoteVisible = visible;
      });
    } catch (e) {
      console.log(e);
    }
  };

  checkQuotesShownStatus = (books: BookType[]) => {
    try {
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
      console.log(e);
    }
  };

  getAndSetQuotesModalInfo = (books: BookType[]) => {
    try {
      const currentBookId = this.quoteInfo.bookId;
      if (!currentBookId) {
        // only works the first time

        const firstBook = books[0];
        this.setQuotesModalInfo(firstBook);

        const nextBook = this.getNextBook({
          books,
          currentBookId: firstBook.id,
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
      console.log(e);
    }
  };

  setQuotesModalInfo = async (book: BookType) => {
    try {
      const quotesModalInfo = {
        quote: book.quote,
        bookAuthor: book.author,
        bookName: book.name,
        bookId: book.id,
      };

      runInAction(() => {
        this.quotesModalInfo = quotesModalInfo;
      });
    } catch (e) {
      console.log(e);
    }
  };

  getNextBook = ({
    books,
    currentBookId,
  }: {
    books: BookType[];
    currentBookId: string;
  }) => {
    const currentBookIndex = books.findIndex(book => book.id === currentBookId);

    const nextBookIndex = currentBookIndex + 1;
    return books[nextBookIndex];
  };
}

export default new QuotesStore();
