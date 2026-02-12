import React, { PropsWithChildren } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PlusIcon from '@/src/assets/icons/common/plus.svg';
import { BaseBottomSheet } from '@/src/components/common/bottomSheet/baseBottomSheet';

interface TodoBottomSheetProps extends PropsWithChildren {
  onClickAddCollection: () => void;
  onClose: () => void;
  dismissThreshold?: number;
  initialHeight?: number;
  expandable?: boolean;
}

/**
 * 할 일 담기 BottomSheet 컨테이너 컴포넌트
 */
export const TodoBottomSheet = ({
  onClickAddCollection,
  onClose,
  dismissThreshold = 80,
  initialHeight,
  expandable = true,
  children,
}: TodoBottomSheetProps) => {
  return (
    <BaseBottomSheet
      onClose={onClose}
      dismissThreshold={dismissThreshold}
      initialHeight={initialHeight}
      expandable={expandable}
      className="gap-4"
    >
      {/* Header 영역 */}
      <View className="flex-row items-center justify-between px-5 pb-6">
        <Text className="text-heading-xl text-black">할 일 담기</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onClickAddCollection}
          className="flex-row items-center gap-0.5"
        >
          <PlusIcon width={16} height={16} color="#4E5968" />
          <Text className="text-caption-md text-grey-700">모음 추가</Text>
        </TouchableOpacity>
      </View>

      {/* Content 영역 */}
      <View className="flex-1">{children}</View>
    </BaseBottomSheet>
  );
};
