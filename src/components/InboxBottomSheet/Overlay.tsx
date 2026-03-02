import { Pressable, View } from 'react-native';
import Animated, {
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useInboxBottomSheet } from './context';
import { useEffect } from 'react';

const Overlay = () => {
  const { onClose } = useInboxBottomSheet();
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(100, withSpring(0.5, { duration: 300 }));
  }, []);

  return (
    <Pressable onPress={onClose} className="absolute inset-0">
      <Animated.View
        className="absolute inset-0 bg-black"
        style={{ opacity }}
      />
    </Pressable>
  );
};

export default Overlay;
