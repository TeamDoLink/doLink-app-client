import type { PropsWithChildren } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import BackIcon from '@/src/assets/icons/common/back.svg';
import SearchIcon from '@/src/assets/icons/common/search-36.svg';
import OptionIcon from '@/src/assets/icons/common/option-36.svg';
import { TextButton } from '@/src/components/common/button/textButton';
import { BaseBottomSheet } from '@/src/components/common/bottomSheet/baseBottomSheet';

interface ArchiveAddBottomSheetProps extends PropsWithChildren {
  title: string;
  onClose: () => void;
  onPressBack?: () => void;
  onPressSave?: () => void;
  onPressSearch?: () => void;
  onPressOption?: () => void;
  isSaveDisabled?: boolean;
}

/**
 * 모음 관련 전체 바텀시트 컴포넌트
 * - 드래그로 닫기 가능
 * - 뒤로, 임시저장(optional), 검색(optional), 옵션(optional) 버튼 제공
 */
export const ArchiveAddBottomSheet = ({
  title,
  onClose,
  onPressBack,
  onPressSave,
  onPressSearch,
  onPressOption,
  isSaveDisabled = false,
  children,
}: ArchiveAddBottomSheetProps) => {
  const handleBackPress = () => {
    if (onPressBack) {
      onPressBack();
    } else {
      onClose();
    }
  };

  return (
    <BaseBottomSheet onClose={onClose} contentClassName="gap-6">
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={handleBackPress}
            className="h-9 w-9 items-center justify-center rounded-lg"
            accessibilityLabel="뒤로"
          >
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-heading-lg text-grey-900">{title}</Text>
        </View>

        <View className="flex-row items-center gap-1">
          {onPressSave && (
            <TextButton
              disabled={isSaveDisabled}
              onPress={onPressSave}
              accessibilityLabel="임시저장"
              className="text-caption-md text-grey-500"
            >
              임시저장
            </TextButton>
          )}
          {onPressSearch && (
            <TouchableOpacity
              onPress={onPressSearch}
              className="h-9 w-9 items-center justify-center rounded-lg"
              accessibilityLabel="검색"
            >
              <SearchIcon width={36} height={36} />
            </TouchableOpacity>
          )}
          {onPressOption && (
            <TouchableOpacity
              onPress={onPressOption}
              className="h-9 w-9 items-center justify-center rounded-lg"
              accessibilityLabel="옵션"
            >
              <OptionIcon width={36} height={36} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View>{children}</View>
    </BaseBottomSheet>
  );
};

export default ArchiveAddBottomSheet;
