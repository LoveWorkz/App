export interface TileHeadline {
  en: string;
  de: string;
  pt: string;
}

export interface Description {
  en: string;
  de: string;
  pt: string;
}

export interface Paragraphs {
  en: string[];
  de: string[];
  pt: string[];
}

export interface Program {
  id: number;
  description: string;
}

export interface Programs {
  en: Program[];
  de: Program[];
  pt: Program[];
}

export interface Contact {
  type: string;
  value: string;
  uri: string;
}

export interface Therapist {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  image_name: string;
  tile_headline: TileHeadline;
  languages: string[];
  description: Description;
  paragraphs: Paragraphs;
  programs: Programs;
  contacts: Contact[];
}
