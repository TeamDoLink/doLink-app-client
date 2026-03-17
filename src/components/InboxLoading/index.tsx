import { useEffect } from 'react';
import { View, Text, Pressable, PanResponder, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

// 성공, 실패 svg
import { CheckCircle, XCircle } from 'lucide-react-native';

export interface InboxLoadingProps {
  status: 'none' | 'loading' | 'error' | 'success';
  onPress?: (status: InboxLoadingProps['status']) => void;
}

const InboxLoading = ({ status = 'none', onPress }: InboxLoadingProps) => {
  if (status === 'none') {
    return null;
  }

  return (
    <View
      className="absolute inset-0 items-center justify-center bg-white/5"
      pointerEvents="box-none"
    >
      <Pressable className="absolute inset-0"></Pressable>
      <View className="h-[118px] w-[112px] items-center justify-center rounded-lg bg-black/60">
        <Pressable onPress={() => onPress?.(status)}>
          <View className="flex-col items-center justify-center gap-3">
            {status === 'loading' && <Loading />}
            {status === 'error' && <Error />}
            {status === 'success' && <Success />}
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const Loading = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = 0;
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <>
      <Animated.Image
        source={require('@/src/assets/icons/spinner/spinner.png')}
        className="h-8 w-8"
        style={animatedStyle}
      />
      <Text className="text-caption-sm text-white underline">취소</Text>
    </>
  );
};

const Error = () => {
  return (
    <>
      <XCircle color="white" size={32} />
      <Text className="text-caption-sm text-white underline">에러</Text>
    </>
  );
};

const Success = () => {
  return (
    <>
      <CheckCircle color="white" size={32} />
      <Text className="text-caption-sm text-white underline">성공</Text>
    </>
  );
};

export default InboxLoading;
