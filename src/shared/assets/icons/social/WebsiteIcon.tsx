import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const WebsiteIcon = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" {...props}>
    <Path
      stroke={props.stroke ?? '#395180'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19 10a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H1m9 9a9 9 0 0 1-9-9m9 9a13.77 13.77 0 0 0 3.6-9A13.77 13.77 0 0 0 10 1m0 18a13.77 13.77 0 0 1-3.6-9A13.77 13.77 0 0 1 10 1m-9 9a9 9 0 0 1 9-9"
    />
  </Svg>
);
export default WebsiteIcon;
