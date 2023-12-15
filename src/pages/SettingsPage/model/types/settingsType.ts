import {ReactNode} from 'react';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

export interface SettingItemType {
  Icon: string;
  text: string;
  path?: AppRouteNames;
  onPress?: () => void;
  RightSideComponent?: ReactNode;
  isPressable?: boolean;
}
