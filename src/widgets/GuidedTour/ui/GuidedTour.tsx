import {memo, useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, Dimensions, Platform} from 'react-native';

import LottieView from 'lottie-react-native';
import guidedTourStore from '../model/store/guidedTourStore';
import GuidedTourModal1 from './GuideTourModal1';
import GuidedTourModal2 from './GuideTourModal2';
import GuidedTourModal3 from './GuideTourModal3';
import GuidedTourModal4 from './GuideTourModal4';
import GuidedTourModal5 from './GuideTourModal5';
import {observer} from 'mobx-react-lite';
import Modal from 'react-native-modal';

import Way from '@src/shared/assets/json/Way.json';
import Flower from '@src/shared/assets/json/Flower.json';
import More from '@src/shared/assets/json/More.json';
import Settings from '@src/shared/assets/json/Settings.json';
import {isPlatformIos} from '@src/shared/consts/common';

import WayDark from '@src/shared/assets/json/Way-dark.json';
import FlowerDark from '@src/shared/assets/json/Flower-dark.json';
import MoreDark from '@src/shared/assets/json/More-dark.json';
import SettingsDark from '@src/shared/assets/json/Settings-dark.json';
import {useTheme} from '@src/app/providers/themeProvider';

const Animation = memo(({source, onLoad, visible}: any) => {
  const animationRef = useRef(null);

  useEffect(() => {
    if (!visible && animationRef.current) {
      // Pause and reset the animation when hiding
      animationRef.current.reset();
      animationRef.current.pause();
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <LottieView
      ref={animationRef}
      style={{
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 1,
      }}
      source={source}
      autoPlay
      resizeMode="cover"
      onAnimationLoaded={() => {
        if (!isPlatformIos && onLoad) {
          onLoad();
        }
      }}
      onLayout={() => {
        if (isPlatformIos && onLoad) {
          onLoad();
        }
      }}
    />
  );
});

const GuidedTour = observer(() => {
  const isGuidedTourCompleted = guidedTourStore.isGuidedTourCompleted;
  if (isGuidedTourCompleted) {
    return null;
  }

  return <GuidedTourContent />;
});

const GuidedTourContent = observer(() => {
  const [visible, setVisible] = useState(true);
  const [guideModal1Visible, setGuideModal1Visible] = useState(false);
  const [guideModal2Visible, setGuideModal2Visible] = useState(false);
  const [guideModal3Visible, setGuideModal3Visible] = useState(false);
  const [guideModal4Visible, setGuideModal4Visible] = useState(false);
  const [guideModal5Visible, setGuideModal5Visible] = useState(true);

  const [showAnimation1, setShowAnimation1] = useState(false);
  const [showAnimation2, setShowAnimation2] = useState(false);
  const [showAnimation3, setShowAnimation3] = useState(false);
  const [showAnimation4, setShowAnimation4] = useState(false);
  const {isDark} = useTheme()

  const hideModal1 = useCallback(() => {
    setGuideModal2Visible(true);
    setGuideModal1Visible(false);
    setShowAnimation2(true);
  }, []);

  const hideModal2 = useCallback(() => {
    setGuideModal3Visible(true);
    setGuideModal2Visible(false);
    setShowAnimation3(true);
  }, []);

  const hideModal3 = useCallback(() => {
    setGuideModal4Visible(true);
    setGuideModal3Visible(false);
    setShowAnimation4(true);
  }, []);

  const hideModal4 = useCallback(() => {
    setGuideModal4Visible(false);
    setShowAnimation4(false);

    guidedTourStore.handleGuidedTourCompleteLogic();
  }, []);

  const hideModal5 = useCallback(() => {
    setGuideModal5Visible(false);

    setShowAnimation1(true);
    setGuideModal1Visible(true);
  }, []);

  const onModal4Hide = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <Modal
      style={{
        margin: 0,
      }}
      isVisible={visible}
      backdropOpacity={0}
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={0}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}>
      <View style={{flex: 1}}>
        <Animation visible={showAnimation1} source={isDark ? WayDark : Way} />
        <Animation
          visible={showAnimation2}
          source={isDark ? FlowerDark : Flower}
          onLoad={() => setShowAnimation1(false)}
        />
        <Animation
          visible={showAnimation3}
          source={isDark ? MoreDark : More}
          onLoad={() => setShowAnimation2(false)}
        />
        <Animation
          visible={showAnimation4}
          source={isDark ? SettingsDark : Settings}
          onLoad={() => setShowAnimation3(false)}
        />

        <GuidedTourModal5
          visible={guideModal5Visible}
          hideModal={hideModal5}
        />

        <GuidedTourModal1 visible={guideModal1Visible} hideModal={hideModal1} />
        <GuidedTourModal2 visible={guideModal2Visible} hideModal={hideModal2} />
        <GuidedTourModal3 visible={guideModal3Visible} hideModal={hideModal3} />
        <GuidedTourModal4 visible={guideModal4Visible} hideModal={hideModal4} onModalHide={onModal4Hide} />

       
      </View>
    </Modal>
  );
});

export default memo(GuidedTour);