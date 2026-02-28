import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedKeyboard,
} from 'react-native-reanimated';
import {
  useKeyboardAnimation,
  useKeyboardState,
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PortalProvider } from '../protal';

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
}>;

export const InboxBottomSheetProvider = ({
  children,
  steps,
  initialStep,
}: InboxBottomSheetProviderProps) => {
  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const keyboardState = useKeyboardState();
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();

  const initialPercent = steps.at(initialStep ?? 0);
  if (!initialPercent) {
    throw new Error('initialStep is out of range');
  }
  const initialHeight = (height * initialPercent) / 100;

  const bottomSheetHeight = useSharedValue<number>(initialHeight);
  const footerHeight = useSharedValue<number>(0);
  const handleHeight = useSharedValue<number>(0);
  const contentHeight = useSharedValue<number>(0);

  const bottomSheetMaxHeight = useDerivedValue(() => {
    return height - (top + bottom);
  });

  const [step, setStep] = useState<number>(initialStep ?? 0);

  const handleStepChange = (step: number) => {
    bottomSheetHeight.value = withSpring(
      bottomSheetMaxHeight.value * (steps[step] / 100) - footerHeight.value ||
        0,
    );
    setStep(step);
  };

  const setFitHeight = useCallback(() => {
    bottomSheetHeight.value = withSpring(
      contentHeight.value + handleHeight.value + footerHeight.value,
    );
  }, []);

  useEffect(() => {
    if (keyboardState.isVisible) {
      handleStepChange(steps.length - 1);
    }
  }, [keyboardState.isVisible]);

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
      }}
    >
      <PortalProvider rootKey="inboxBottomSheet">{children}</PortalProvider>
    </InboxBottomSheetContext.Provider>
  );
};
