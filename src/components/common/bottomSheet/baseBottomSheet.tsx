import { useRef } from 'react';
import type { PropsWithChildren } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  type GestureResponderEvent,
  type PanResponderGestureState,
} from 'react-native';

const DEFAULT_DISMISS_THRESHOLD = 80;

interface BaseBottomSheetProps extends PropsWithChildren {
  onClose: () => void;
  dismissThreshold?: number;
  className?: string;
  contentClassName?: string;
}

/**
 * 공통 바텀시트 래퍼 컴포넌트
 * 드래그 제스처 처리 및 닫기 애니메이션 담당
 * UI는 children을 통해 구성
 */
export const BaseBottomSheet = ({
  onClose,
  dismissThreshold = DEFAULT_DISMISS_THRESHOLD,
  className = '',
  contentClassName = '',
  children,
}: BaseBottomSheetProps) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (
        _event: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (
        _event: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        if (gestureState.dy > dismissThreshold) {
          Animated.timing(translateY, {
            toValue: screenHeight,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
          });
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Animated.View
      className={`w-full rounded-t-3xl bg-white px-5 pb-6 pt-5 ${className}`}
      style={{
        transform: [{ translateY }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.08,
        shadowRadius: 40,
        elevation: 5,
      }}
    >
      <View className="mb-4 flex items-center justify-center">
        <View
          {...panResponder.panHandlers}
          className="h-1 w-12 rounded-[2px] bg-[#D2D9DD]"
        />
      </View>

      <View className={`flex flex-col gap-4 ${contentClassName}`.trim()}>
        {children}
      </View>
    </Animated.View>
  );
};

export default BaseBottomSheet;
