import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {Collections} from '@src/shared/types/firebase';
import {BookType} from '@src/entities/Book';
import {rubricFilterItemStore} from '@src/entities/RubricFilterItem';

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

  filterBooks = (name: string) => {
    try {
      rubricFilterItemStore.toggleRubricStatus({name});

      if (rubricFilterItemStore.rubricskeys.includes(name)) {
        this.booksFilteredList = rubricFilterItemStore.turnOffFilterByKey({
          key: name,
          list: this.booksList,
        }) as BookType[];
      } else {
        this.booksFilteredList = rubricFilterItemStore.filterByKey({
          key: name,
          list: this.booksFilteredList,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  clearBooksInfo = () => {
    rubricFilterItemStore.clearInfo();
    this.booksFilteredList = this.booksList;
  };
}

export default new BooksStore();
