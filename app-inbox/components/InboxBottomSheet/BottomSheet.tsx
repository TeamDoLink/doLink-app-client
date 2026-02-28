import Animated, { useDerivedValue } from 'react-native-reanimated';
import Handle from './Handle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';
import { useInboxBottomSheet } from './context';
import { useAnimatedStyle } from 'react-native-reanimated';
import { interpolate } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface BottomSheetProps {
  children: React.ReactNode;
}

const BottomSheet = ({ children }: BottomSheetProps) => {
  const { bottomSheetHeight, footerHeight } = useInboxBottomSheet();
  const { bottom } = useSafeAreaInsets();

  if (!bottomSheetHeight || !footerHeight) {
    throw new Error('bottomSheetHeight is not defined');
  }

  const style = useAnimatedStyle(() => {
    return {
      height: bottomSheetHeight?.value + bottom,
      paddingBottom: bottom,
    };
  });

  return (
    <Animated.View className="rounded-t-3xl bg-white" style={style}>
      <Handle />
      {children}
    </Animated.View>
  );
};

export default BottomSheet;
