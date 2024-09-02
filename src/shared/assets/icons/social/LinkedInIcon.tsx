import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const LinkedInIcon = (props: SvgProps) => (
  <Svg width={20} height={19} fill="none" {...props}>
    <Path
      stroke={props.stroke ?? '#395180'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13.333 6.666a5 5 0 0 1 5 5v5.833H15v-5.833a1.667 1.667 0 0 0-3.333 0v5.833H8.333v-5.833a5 5 0 0 1 5-5ZM5 7.5H1.667v10H5v-10ZM3.333 5a1.667 1.667 0 1 0 0-3.334 1.667 1.667 0 0 0 0 3.333Z"
    />
  </Svg>
);
export default LinkedInIcon;
