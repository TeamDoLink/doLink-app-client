import React, { PropsWithChildren } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
// SVG 처리를 위해 react-native-svg-transformer 설정을 주로 사용합니다.
// 만약 일반 이미지처럼 쓰신다면 아래와 같이 import 합니다.
// import PlusIcon from '@/src/assets/icons/common/plus.svg';
import { BaseBottomSheet } from '@/src/components/common/bottomSheet/baseBottomSheet';

interface TodoBottomSheetProps extends PropsWithChildren {
  onClickAddCollection: () => void;
  onClose: () => void;
  dismissThreshold?: number;
}

/**
 * 할 일 담기 BottomSheet 컨테이너 컴포넌트
 */
export const TodoBottomSheet = ({
  onClickAddCollection,
  onClose,
  dismissThreshold = 80,
  children,
}: TodoBottomSheetProps) => {
  return (
    <BaseBottomSheet
      onClose={onClose}
      dismissThreshold={dismissThreshold}
      // NativeWind를 사용한다면 className 사용 가능
      className="gap-4"
    >
      {/* Header 영역 */}
      <View className="flex-row items-center justify-between">
        <Text className="text-heading-xl text-black">할일 담기</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onClickAddCollection}
          className="flex-row items-center gap-1"
        >
          {/* RN에서는 SVG를 컴포넌트로 다루는 경우가 많습니다 */}
          {/* <PlusIcon width={12} height={12} fill="#6B7280" /> */}
          <Text className="caption-md text-gray-500">모음 추가</Text>
        </TouchableOpacity>
      </View>

      {/* Content 영역 */}
      <View>{children}</View>
    </BaseBottomSheet>
  );
};
