import { useRef, useState, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  Keyboard,
  Platform,
  type GestureResponderEvent,
  type PanResponderGestureState,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** 기본 임계값 설정 */
const DEFAULT_DISMISS_THRESHOLD = 80; // 아래로 이만큼 내리면 닫힘/축소
const DEFAULT_EXPAND_THRESHOLD = -50; // 위로 이만큼 올리면 확장

interface BaseBottomSheetProps extends PropsWithChildren {
  onClose: () => void; // 시트가 완전히 닫힐 때 실행될 콜백
  dismissThreshold?: number; // 닫기 판정 거리
  expandThreshold?: number; // 확장 판정 거리
  expandable?: boolean; // 확장 기능 활성화 여부
  initialHeight?: number; // 초기 시트 높이
  expandedHeight?: number; // 확장 시 시트 높이
  className?: string; // 컨테이너 스타일링 (NativeWind)
  contentClassName?: string; // 내부 콘텐츠 스타일링
}

/**
 * [공통 컴포넌트] BaseBottomSheet
 * PanResponder를 활용하여 드래그 제스처를 감지하고,
 * Animated API를 통해 시트의 높이 변화 및 위치 이동을 제어합니다.
 */
export const BaseBottomSheet = ({
  onClose,
  dismissThreshold = DEFAULT_DISMISS_THRESHOLD,
  expandThreshold = DEFAULT_EXPAND_THRESHOLD,
  expandable = true,
  initialHeight,
  expandedHeight,
  className = '',
  contentClassName = '',
  children,
}: BaseBottomSheetProps) => {
  const { top: statusBarHeight } = useSafeAreaInsets(); // 기기별 실제 노치/상단 바 높이
  const screenHeight = Dimensions.get('window').height;

  const defaultInitialHeight = initialHeight ?? screenHeight * 0.6;

  const GAP = 100;
  const defaultExpandedHeight =
    expandedHeight ?? screenHeight - statusBarHeight - GAP;

  /** 상태 관리 및 애니메이션 레프(Ref) */
  const [isExpanded, setIsExpanded] = useState(false);

  // heightAnim: 시트 자체의 '높이'를 조절 (Layout 변화 동반, useNativeDriver 사용 불가)
  const heightAnim = useRef(new Animated.Value(defaultInitialHeight)).current;

  // translateY: 시트의 '수직 위치'를 조절 (Transform, useNativeDriver 사용 가능 - 성능 우수)
  const translateY = useRef(new Animated.Value(0)).current;

  /** 시트를 전체 높이로 확장하는 애니메이션 */
  const expandSheet = () => {
    setIsExpanded(true);
    Animated.timing(heightAnim, {
      toValue: defaultExpandedHeight,
      duration: 250,
      useNativeDriver: false, // height 속성은 네이티브 드라이버 미지원
    }).start();
  };

  /** 확장된 시트를 초기 높이로 축소하는 애니메이션 */
  const collapseSheet = () => {
    setIsExpanded(false);
    Animated.timing(heightAnim, {
      toValue: defaultInitialHeight,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  /** 키보드 이벤트 리스너 - 키보드가 올라오면 시트 확장 */
  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardShowListener = Keyboard.addListener(showEvent, () => {
      if (expandable && !isExpanded) {
        expandSheet();
      }
    });

    const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
      if (isExpanded) {
        // collapseSheet();
      }
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [expandable, isExpanded]);

  /** 사용자 드래그 제스처 처리를 위한 PanResponder 설정 */
  const panResponder = useRef(
    PanResponder.create({
      // 1. 터치 시작 시에는 이벤트를 가로채지 않음 (TextInput 클릭 허용)
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // 미세한 움직임(5px 미만)에는 반응하지 않음 (스크롤 뷰 등과 간섭 방지)
        return Math.abs(gestureState.dy) > 5;
      },

      // 2. 드래그 중 실시간 처리
      onPanResponderMove: (
        _event: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        // 아래로 드래그할 때만 시트가 실시간으로 따라 내려오도록 설정 (시각적 피드백)
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
        // 위로 드래그 시 heightAnim을 직접 조절할 수도 있으나, 여기서는 Release 시점에 처리하도록 설계됨
      },

      // 3. 드래그 종료(손을 뗌) 시 처리
      onPanResponderRelease: (
        _event: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        /** CASE 1: 위로 드래그 - 시트 확장 */
        if (expandable && gestureState.dy < expandThreshold && !isExpanded) {
          expandSheet();
          translateY.setValue(0); // 위치 초기화
          return;
        }

        if (gestureState.dy > dismissThreshold) {
          /** CASE 2: 아래로 드래그 - 축소 또는 완전히 닫기 */
          if (isExpanded) {
            // 확장 상태였다면 초기 상태로 축소
            collapseSheet();
            Animated.timing(translateY, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }).start();
          } else {
            // 초기 상태였다면 화면 아래로 완전히 밀어내고 닫기 콜백 실행
            Animated.timing(translateY, {
              toValue: screenHeight,
              duration: 200,
              useNativeDriver: false,
            }).start(() => {
              onClose();
            });
          }
          return;
        }

        /** CASE 3: 임계값에 미달한 경우 - 원상 복구 */
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  return (
    <Animated.View
      className={`w-full rounded-t-3xl bg-white px-5 pb-6 pt-5 ${className}`}
      style={{
        height: heightAnim, // 동적 높이 적용
        transform: [{ translateY }], // 드래그에 따른 위치 이동
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.08,
        shadowRadius: 40,
        elevation: 5,
      }}
    >
      {/* 바텀시트 상단 핸들 (드래그 가능 영역) */}
      <View className="mb-4 flex items-center justify-center">
        <View
          {...panResponder.panHandlers} // 제스처 핸들러 연결
          className="h-1 w-12 rounded-[2px] bg-[#D2D9DD]"
          // 터치 영역 확장 (UX 개선)
          hitSlop={{ top: 20, bottom: 20, left: 40, right: 40 }}
        />
      </View>

      {/* 내부 콘텐츠 렌더링 영역 */}
      <View className={`flex flex-1 flex-col gap-4 ${contentClassName}`.trim()}>
        {children}
      </View>
    </Animated.View>
  );
};

export default BaseBottomSheet;
