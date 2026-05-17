import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  useKeyboardHandler,
  useKeyboardState,
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PortalProvider } from '../Portal';
import { runOnJS, scheduleOnRN } from 'react-native-worklets';

interface InboxBottomSheetContextType {
  // %단위의 높이로, 가장 가까운 step으로 이동합니다
  steps: number[];

  // 초기 step 위치
  initialStep?: number;

  // 현재 step 위치
  step: number;
  setStep: (step: number) => void;

  // 바텀시트 높이의 SharedValue입니다
  bottomSheetHeight?: SharedValue<number>;

  // 푸터 높이의 SharedValue입니다
  footerHeight?: SharedValue<number>;

  // 핸들 높이의 SharedValue입니다
  handleHeight?: SharedValue<number>;

  // 바텀시트 최대 높이의 SharedValue입니다
  bottomSheetMaxHeight?: SharedValue<number>;

  // 컨텐츠의 높이값 입니다.
  contentHeight?: SharedValue<number>;

  setFitHeight: () => void;

  onClose?: () => void;
}

const InboxBottomSheetContext = createContext<InboxBottomSheetContextType>({
  steps: [],
  step: 0,
  setStep: () => {},
  setFitHeight: () => {},
});

export const useInboxBottomSheet = () => {
  const context = useContext(InboxBottomSheetContext);
  if (!context) {
    throw new Error(
      'useInboxBottomSheet must be used within a InboxBottomSheetProvider',
    );
  }
  return context;
};

type InboxBottomSheetProviderProps = PropsWithChildren<{
  steps: number[];
  initialStep?: number;
  onClose?: () => void;
  viewportHeight?: number;
}>;

export const InboxBottomSheetProvider = ({
  children,
  steps,
  initialStep,
  onClose,
  viewportHeight,
}: InboxBottomSheetProviderProps) => {
  const { height: windowHeight } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const height = viewportHeight ?? windowHeight;

  const initialPercent = steps.at(initialStep ?? 0);
  if (!initialPercent) {
    throw new Error('initialStep is out of range');
  }

  const calculateHeight = (height * initialPercent) / 100;

  const footerHeight = useSharedValue<number>(0);
  const handleHeight = useSharedValue<number>(0);
  const contentHeight = useSharedValue<number>(0);

  const bottomSheetMaxHeight = useDerivedValue(() => {
    return height - (top + bottom) - footerHeight.value - handleHeight.value;
  });
  const initialHeight = Math.min(calculateHeight, bottomSheetMaxHeight.value);

  const bottomSheetHeight = useSharedValue<number>(initialHeight);

  const [step, setStep] = useState<number>(initialStep ?? 0);

  const calculateStepHeight = (step: number) => {
    return (
      bottomSheetMaxHeight.value * (steps[step] / 100) - footerHeight.value || 0
    );
  };

  const handleStepChange = (step: number) => {
    bottomSheetHeight.value = withSpring(calculateStepHeight(step) || 0);
    setStep(step);
  };

  const setFitHeight = useCallback(() => {
    bottomSheetHeight.value = withSpring(
      contentHeight.value + handleHeight.value + footerHeight.value,
    );
  }, []);

  const { progress } = useReanimatedKeyboardAnimation();

  // 키보드가 열릴때 바텀시트의 높이를 최대 높이로 변경합니다
  // 키보드가 열리는 변화량에 따라 바텀시트도 동일한 속도로 높이를 변경합니다
  // useAnimatedReaction(
  //   () => progress.value,
  //   (progress) => {
  //     bottomSheetHeight.value = interpolate(progress, [0, 1], [bottomSheetHeight.value, bottomSheetMaxHeight.value]);
  //   }
  // )

  useKeyboardHandler({
    onStart: (e) => {
      'worklet';
      if (e.progress === 1) {
        bottomSheetHeight.value = withSpring(bottomSheetMaxHeight.value);
      }
    },
  });

  return (
    <InboxBottomSheetContext.Provider
      value={{
        steps,
        initialStep,
        step,
        setStep: handleStepChange,
        bottomSheetHeight,
        footerHeight,
        handleHeight,
        bottomSheetMaxHeight,
        contentHeight,
        setFitHeight,
        onClose,
      }}
    >
      <PortalProvider rootKey="inboxBottomSheet">{children}</PortalProvider>
    </InboxBottomSheetContext.Provider>
  );
};
