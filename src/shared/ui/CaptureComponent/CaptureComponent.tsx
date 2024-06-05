import React, {useCallback, useEffect, useRef} from 'react';
import ViewShot from 'react-native-view-shot';

interface CaptureComponentProps {
  captureHandler: (url: string) => void;
  children: React.ReactNode;
}

export const CaptureComponent = (props: CaptureComponentProps) => {
  const {captureHandler, children} = props;

  const captureRef = useRef() as React.MutableRefObject<any>;

  const onCapture = useCallback(() => {
    setTimeout(() => {
      captureRef.current?.capture().then((uri: string) => {
        captureHandler(uri);
      });
      // calling capture after 500ms because there is some UI bug
    }, 500);
  }, [captureHandler]);

  useEffect(() => {
    onCapture();
  }, [onCapture]);

  return (
    <ViewShot
      ref={captureRef}
      options={{
        format: 'jpg',
        quality: 1.0,
      }}>
      {children}
    </ViewShot>
  );
};
