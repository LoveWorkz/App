import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {Collections} from '@src/shared/types/firebase';
import {BookType} from '@src/entities/Book';

class BooksStore {
  booksList: BookType[] = [];
  booksFilteredList: BookType[] = [];
  recommendedBooksList: BookType[] = [];
  booksSize: number = 0;
  constructor() {
    makeAutoObservable(this);
  }

  getBooks = async () => {
    try {
      const data = await firestore().collection(Collections.BOOKS).get();
      const booksList = data.docs.map(book => book.data());
      runInAction(() => {
        this.booksSize = data.size;
        this.booksList = booksList as BookType[];
        this.booksFilteredList = booksList as BookType[];
        this.recommendedBooksList = booksList as BookType[];
      });
    } catch (e) {
      console.log(e);
    }
  };

  filterBooks = (key: string) => {
    this.booksFilteredList = this.booksList.filter(book =>
      book.Categories.includes(key),
    );
  };
}

export default new BooksStore();
