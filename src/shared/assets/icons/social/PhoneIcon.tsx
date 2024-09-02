import * as React from 'react';
import Svg, {SvgProps, Rect} from 'react-native-svg';
export const PhoneIcon = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" {...props}>
    <Rect
      width={10.5}
      height={16.5}
      x={7.101}
      y={0.919}
      stroke={props.stroke ?? '#395180'}
      strokeWidth={1.5}
      rx={3.25}
      transform="rotate(15 7.101 .919)"
    />
    <Rect
      width={3.25}
      height={0.75}
      x={9.951}
      y={4.145}
      stroke={props.stroke ?? '#395180'}
      strokeWidth={0.75}
      rx={0.375}
      transform="rotate(15 9.951 4.145)"
    />
  </Svg>
);
export default PhoneIcon;
