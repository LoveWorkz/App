import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const EmailIcon = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" {...props}>
    <Path
      stroke={props.stroke ?? '#395180'}
      strokeWidth={1.5}
      d="M.75 7.586a3.25 3.25 0 0 1 1.916-2.963l6-2.7a3.25 3.25 0 0 1 2.668 0l6 2.7a3.25 3.25 0 0 1 1.916 2.963V13A3.25 3.25 0 0 1 16 16.25H4A3.25 3.25 0 0 1 .75 13V7.586Z"
    />
    <Path
      stroke={props.stroke ?? '#395180'}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M4 8s2 2 6 2 6-2 6-2"
    />
  </Svg>
);
export default EmailIcon;
