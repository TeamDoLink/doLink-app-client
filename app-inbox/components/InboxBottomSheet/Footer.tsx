import { ViewProps } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { useInboxBottomSheet } from './context';
import { PortalIn } from '../protal';

interface FooterProps extends ViewProps {}

const Footer = ({ className, ...props }: FooterProps) => {
  const { footerHeight } = useInboxBottomSheet();
  const { height: keyboardHeight } = useAnimatedKeyboard();

  if (!footerHeight) {
    throw new Error('footerHeight is not defined');
  }

  // progress 0→1 에 맞춰 keyboardHeight만큼 위로 이동 (Animated만 사용)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: keyboardHeight.value * -1 }],
    };
  });

  return (
    <PortalIn portalKey="footer">
      <Animated.View
        onLayout={(event) => {
          footerHeight.value = event.nativeEvent.layout.height;
        }}
        style={animatedStyle}
        className={`bg-white px-5 pb-6 ${className}`}
        {...props}
      />
    </PortalIn>
  );
};

export default Footer;
