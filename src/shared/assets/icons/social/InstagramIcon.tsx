import * as React from 'react';
import Svg, {SvgProps, Path, G, Defs, ClipPath} from 'react-native-svg';
export const InstagramIcon = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path
        stroke={props.stroke ?? '#395180'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M14.583 5.416h.009m-8.759-3.75h8.334a4.167 4.167 0 0 1 4.166 4.167v8.333a4.167 4.167 0 0 1-4.166 4.167H5.833a4.167 4.167 0 0 1-4.166-4.167V5.833a4.167 4.167 0 0 1 4.166-4.167Zm7.5 7.808a3.333 3.333 0 1 1-6.593.978 3.333 3.333 0 0 1 6.593-.978Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={props.stroke ?? '#395180'} d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default InstagramIcon;
