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
  rubrics: string[];
  description: BookFieldType;
  id: string;
  image: BookImage;
  displayName: BookFieldType;
  rate: number;
  quote: BookFieldType;
  links: BookFieldType;
}
