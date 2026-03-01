import { ViewProps } from 'react-native';
import Animated, {
  interpolate,
  KeyboardState,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { useInboxBottomSheet } from './context';
import { PortalIn } from '../protal';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

interface FooterProps extends ViewProps {}

const Footer = ({ className, ...props }: FooterProps) => {
  const { footerHeight } = useInboxBottomSheet();
  const { height: keyboardHeight, state } = useAnimatedKeyboard();
  const { bottom } = useSafeAreaInsets();

  if (!footerHeight) {
    throw new Error('footerHeight is not defined');
  }

  // progress 0→1 에 맞춰 keyboardHeight만큼 위로 이동 (Animated만 사용)
  const animatedStyle = useAnimatedStyle(() => {
    let translateY = keyboardHeight.value * -1;
    if ([KeyboardState.OPENING, KeyboardState.OPEN].includes(state.value)) {
      translateY += bottom;
    }

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <PortalIn portalKey="footer">
      <SafeAreaView
        edges={['bottom']}
        className="bg-white"
        onLayout={(event) => {
          footerHeight.value = event.nativeEvent.layout.height;
        }}
      >
        <Animated.View
          style={animatedStyle}
          className={`px-5 py-2 ${className}`}
          {...props}
        />
      </SafeAreaView>
    </PortalIn>
  );
};

export default Footer;
