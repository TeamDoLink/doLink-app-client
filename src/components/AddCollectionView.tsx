/**
 * AddCollectionView
 * 새로운 모음(컬렉션)을 추가하는 화면 컴포넌트
 * - CollectionBottomSheet 내부에서 슬라이드 전환으로 표시
 * - 모음 이름 입력 및 카테고리 선택 기능
 */
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ARCHIVE_CATEGORY_EDITOR_ITEMS } from '../constants/archiveCategoryEditor';
import { ArchiveCategory, ARCHIVE_CATEGORY_LABEL } from '../constants/category';

/** doLink-web `archiveSelect` grid-cols-5 와 동일하게 한 줄에 5개 */
const CATEGORY_ROW_SIZE = 5;

const CATEGORY_ROWS = Array.from(
  {
    length: Math.ceil(ARCHIVE_CATEGORY_EDITOR_ITEMS.length / CATEGORY_ROW_SIZE),
  },
  (_, rowIndex) =>
    ARCHIVE_CATEGORY_EDITOR_ITEMS.slice(
      rowIndex * CATEGORY_ROW_SIZE,
      rowIndex * CATEGORY_ROW_SIZE + CATEGORY_ROW_SIZE,
    ),
);

/** Props 타입 정의 */
interface AddCollectionViewProps {
  onBack?: () => void;
  onAdd?: (name: string, category: ArchiveCategory) => void;
  name?: string;
  onNameChange?: (name: string) => void;
  selectedCategory: ArchiveCategory | null;
  onCategoryChange: (category: ArchiveCategory) => void;
  hideButton?: boolean;
  /** true이면 카테고리 리스트만 표시 (모음 이름 입력 영역 숨김) */
  showOnlyCategory?: boolean;
}

/** 최대 이름 길이 */
const MAX_NAME_LENGTH = 20;

export default function AddCollectionView({
  onBack,
  onAdd,
  name = '',
  onNameChange,
  selectedCategory,
  onCategoryChange,
  hideButton = false,
  showOnlyCategory = false,
}: AddCollectionViewProps) {
  /** Input focus 상태 */
  const [isFocused, setIsFocused] = useState(false);

  /** 이름 변경 핸들러 */
  const handleNameChange = (text: string) => {
    if (text.length <= MAX_NAME_LENGTH) {
      onNameChange?.(text);
    }
  };

  /** 카테고리 선택 핸들러 */
  const handleCategorySelect = (categoryId: ArchiveCategory) => {
    onCategoryChange(categoryId);
  };

  /** 추가하기 버튼 활성화 여부 */
  const isAddEnabled = name.trim().length > 0 && selectedCategory !== null;

  /** 추가하기 핸들러 */
  const handleAdd = () => {
    if (isAddEnabled && selectedCategory) {
      onAdd?.(name.trim(), selectedCategory);
    }
  };

  return (
    <View>
      <View className="mx-[20px]">
        {/* 모음 이름 섹션 (showOnlyCategory가 true면 숨김) */}
        {!showOnlyCategory && (
          <View className="mb-6">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-[14px] font-semibold leading-[20px] text-black">
                모음 이름
              </Text>
              <Text className="text-caption-sm text-grey-500">
                {name.length}/{MAX_NAME_LENGTH}
              </Text>
            </View>
            <View
              className={`rounded-[10px] border bg-white px-4 py-4 ${
                isFocused ? 'border-grey-800' : 'border-grey-200'
              }`}
            >
              <TextInput
                value={name}
                onChangeText={handleNameChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="모음명을 입력해주세요."
                placeholderTextColor="#9C9FAE"
                className="text-body-md text-grey-900"
                style={{ padding: 0 }}
                maxLength={MAX_NAME_LENGTH}
              />
            </View>
          </View>
        )}

        {/* 카테고리 섹션 */}
        <View>
          <Text className="mb-3 text-[14px] font-semibold leading-[20px] text-black">
            카테고리
          </Text>

          {CATEGORY_ROWS.map((row, rowIndex) => (
            <View
              key={rowIndex}
              className={`flex-row justify-between ${rowIndex < CATEGORY_ROWS.length - 1 ? 'mb-6' : ''}`}
            >
              {row.map((item) => (
                <CategoryButton
                  key={item.key}
                  item={item}
                  isSelected={selectedCategory === item.key}
                  onPress={() => handleCategorySelect(item.key)}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* 하단 CTA 버튼 */}
      {!hideButton && (
        <View className="bg-white px-5 py-4">
          <TouchableOpacity
            className={`items-center justify-center rounded-[12px] py-[14px] ${
              isAddEnabled ? 'bg-point' : 'bg-grey-50'
            }`}
            onPress={handleAdd}
            activeOpacity={0.8}
            disabled={!isAddEnabled}
          >
            <Text
              className={`text-center text-body-xl ${
                isAddEnabled ? 'text-white' : 'text-grey-400'
              }`}
            >
              추가하기
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

type ArchiveCategoryEditorItem = (typeof ARCHIVE_CATEGORY_EDITOR_ITEMS)[number];

/** 카테고리 버튼 컴포넌트 */
interface CategoryButtonProps {
  item: ArchiveCategoryEditorItem;
  isSelected: boolean;
  onPress: () => void;
}

function CategoryButton({ item, isSelected, onPress }: CategoryButtonProps) {
  const Icon = isSelected ? item.selected : item.unselected;
  const label = ARCHIVE_CATEGORY_LABEL[item.key];

  return (
    <TouchableOpacity
      className="w-[54px] items-center"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="mb-1.5 overflow-hidden rounded-full">
        <Icon width={40} height={40} />
      </View>
      <Text
        className={`text-center text-[13px] font-medium leading-[18px] ${
          isSelected ? 'text-point' : 'text-grey-800'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
