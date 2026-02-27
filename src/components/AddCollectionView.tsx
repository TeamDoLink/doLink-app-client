/**
 * AddCollectionView
 * 새로운 모음(컬렉션)을 추가하는 화면 컴포넌트
 * - CollectionBottomSheet 내부에서 슬라이드 전환으로 표시
 * - 모음 이름 입력 및 카테고리 선택 기능
 */
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import BackIcon from '@/src/assets/icons/common/back.svg';
import { ArchiveCategory, ARCHIVE_CATEGORY_LABEL } from '../constants/category';
import { CategoryEditorIconImage } from '../constants/images';

/** 카테고리 목록 (표시 순서) */
const CATEGORY_ORDER: ArchiveCategory[] = [
  'restaurant',
  'hobby',
  'travel',
  'money',
  'shopping',
  'exercise',
  'career',
  'study',
  'tips',
  'etc',
];

/** Props 타입 정의 */
interface AddCollectionViewProps {
  onBack: () => void;
  onAdd?: (name: string, category: ArchiveCategory) => void;
  name: string;
  onNameChange: (name: string) => void;
  selectedCategory: ArchiveCategory | null;
  onCategoryChange: (category: ArchiveCategory) => void;
  hideButton?: boolean;
}

/** 최대 이름 길이 */
const MAX_NAME_LENGTH = 20;

export default function AddCollectionView({
  onBack,
  onAdd,
  name,
  onNameChange,
  selectedCategory,
  onCategoryChange,
  hideButton = false,
}: AddCollectionViewProps) {
  /** Input focus 상태 */
  const [isFocused, setIsFocused] = useState(false);

  /** 이름 변경 핸들러 */
  const handleNameChange = (text: string) => {
    if (text.length <= MAX_NAME_LENGTH) {
      onNameChange(text);
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
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="mx-[20px]">
        {/* 모음 이름 섹션 */}
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

        {/* 카테고리 섹션 */}
        <View>
          <Text className="mb-3 text-[14px] font-semibold leading-[20px] text-black">
            카테고리
          </Text>

          {/* 첫 번째 줄: 맛집, 취미, 여행, 재테크, 쇼핑 */}
          <View className="mb-4 flex-row justify-between">
            {CATEGORY_ORDER.slice(0, 5).map((categoryId) => (
              <CategoryButton
                key={categoryId}
                categoryId={categoryId}
                isSelected={selectedCategory === categoryId}
                onPress={() => handleCategorySelect(categoryId)}
              />
            ))}
          </View>

          {/* 두 번째 줄: 운동, 커리어, 자기계발, 꿀팁, 기타 */}
          <View className="flex-row justify-between">
            {CATEGORY_ORDER.slice(5, 10).map((categoryId) => (
              <CategoryButton
                key={categoryId}
                categoryId={categoryId}
                isSelected={selectedCategory === categoryId}
                onPress={() => handleCategorySelect(categoryId)}
              />
            ))}
          </View>
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
    </ScrollView>
  );
}

/** 카테고리 버튼 컴포넌트 */
interface CategoryButtonProps {
  categoryId: ArchiveCategory;
  isSelected: boolean;
  onPress: () => void;
}

function CategoryButton({
  categoryId,
  isSelected,
  onPress,
}: CategoryButtonProps) {
  const icons = CategoryEditorIconImage[categoryId];
  const Icon = isSelected ? icons.selected : icons.unselected;
  const label = ARCHIVE_CATEGORY_LABEL[categoryId];

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
