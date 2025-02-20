import {NavigationState, SceneRendererProps} from 'react-native-tab-view';

export interface SelectOption {
  value: string | number;
  label: string;
}

export type StyleType =
  | Record<string, string | number | object | undefined>
  | Record<string, string | number | object | undefined>[];

export interface DisplayText {
  en: string;
  de: string;
  pt: string;
}

export enum DocumentType {
  RUBRIC = 'rubric',
  CATEGORY = 'category',
  FAVORITE = 'favorite',
}

export type TabName =
  | 'Sessions'
  | 'Topics'
  | 'Challenges'
  | 'Books'
  | 'Shop'
  | 'Home';

export type RenderSceneType = SceneRendererProps & {
  navigationState: NavigationState<any>;
};

export interface InformationBlockButtonCoordinates {
  top: number;
  left: number;
}
