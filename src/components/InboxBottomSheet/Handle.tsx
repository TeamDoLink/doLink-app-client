import { useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useInboxBottomSheet } from './context';
import { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { getNearestStepIndex } from './utils';

const Handle = () => {
  const {
    bottomSheetHeight,
    steps,
    setStep,
    handleHeight,
    bottomSheetMaxHeight,
    footerHeight,
  } = useInboxBottomSheet();
  const { height } = useWindowDimensions();

  if (!bottomSheetHeight || !handleHeight || !footerHeight) {
    throw new Error('isPressHandle is not defined');
  }

  const startY = useSharedValue<number>(0);

  const onHandleFinish = () => {
    setStep(
      getNearestStepIndex(
        steps,
        bottomSheetMaxHeight!.value,
        bottomSheetHeight.value,
      ),
    );
  };

  const pan = Gesture.Pan()
    .onBegin((event) => {
      startY.value = event.y;
    })
    .onUpdate((event) => {
      bottomSheetHeight.value =
        height -
          event.absoluteY -
          startY.value -
          handleHeight?.value -
          footerHeight?.value || 0;
    })
    .onFinalize((event) => {
      scheduleOnRN(onHandleFinish);
    });

  return (
    <GestureDetector gesture={pan}>
      <View
        className="items-center justify-center py-3"
        onLayout={(event) => {
          handleHeight.value = event.nativeEvent.layout.height;
        }}
      >
        <View className="h-1 w-12 rounded-[2px] bg-[#D2D9DD]" />
      </View>
    </GestureDetector>
  );
};

export default Handle;
