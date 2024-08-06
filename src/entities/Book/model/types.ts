export interface BookImage {
  front: string;
  back: string;
}

export interface BookFieldType {
  en: string;
  de: string;
  pt: string;
}

export interface BookType {
  author: string;
  rubrics: {[key: string]: string[]};
  description: BookFieldType;
  id: string;
  image: BookImage;
  displayName: BookFieldType;
  rate: number;
  quotes?: BookFieldType[];
  link: BookFieldType;
  storage: {
    back_file_name: string;
    front_file_name: string;
  };
}
