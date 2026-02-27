import { createContext, PropsWithChildren, useContext, useState } from 'react';
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
}

const InboxBottomSheetContext = createContext<InboxBottomSheetContextType>({
  steps: [],
  step: 0,
  setStep: () => {},
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

  const initialPercent = steps.at(initialStep ?? 0);
  if (!initialPercent) {
    throw new Error('initialStep is out of range');
  }
  const initialHeight = (height * initialPercent) / 100;

  const bottomSheetHeight = useSharedValue<number>(initialHeight);
  const footerHeight = useSharedValue<number>(0);
  const handleHeight = useSharedValue<number>(0);

  const bottomSheetMaxHeight = useDerivedValue(() => {
    return height - (top + bottom);
  });

  const [step, setStep] = useState<number>(initialStep ?? 0);

  const handleStepChange = (step: number) => {
    bottomSheetHeight.value = withSpring(
      bottomSheetMaxHeight.value * (steps[step] / 100) || 0,
    );
    setStep(step);
  };

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
      }}
    >
      {children}
    </InboxBottomSheetContext.Provider>
  );
};
