import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
export const YoutubeIcon = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" {...props}>
    <Path
      stroke={props.stroke ?? '#395180'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18.783 5.35a2.316 2.316 0 0 0-1.616-1.666c-1.434-.35-7.167-.35-7.167-.35s-5.733 0-7.167.383a2.317 2.317 0 0 0-1.616 1.667 24.167 24.167 0 0 0-.384 4.408c-.01 1.49.12 2.976.384 4.442a2.317 2.317 0 0 0 1.616 1.6c1.434.383 7.167.383 7.167.383s5.733 0 7.167-.383a2.317 2.317 0 0 0 1.616-1.667c.26-1.443.389-2.908.384-4.375.009-1.489-.12-2.976-.384-4.441Z"
    />
    <Path
      stroke={props.stroke ?? '#395180'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m8.125 12.517 4.792-2.725-4.792-2.725v5.45Z"
    />
  </Svg>
);
export default YoutubeIcon;
