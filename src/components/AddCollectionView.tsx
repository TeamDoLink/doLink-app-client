/**
 * AddCollectionView
 * 새로운 모음(컬렉션)을 추가하는 화면 컴포넌트
 * - CollectionBottomSheet 내부에서 슬라이드 전환으로 표시
 * - 모음 이름 입력 및 카테고리 선택 기능
 */
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import BackIcon from '@/src/assets/icons/common/back.svg';
import FoodIcon from '@/src/assets/icons/category/food.svg';
import HobbyIcon from '@/src/assets/icons/category/hobby.svg';
import TravelIcon from '@/src/assets/icons/category/travel.svg';
import MoneyIcon from '@/src/assets/icons/category/money.svg';
import ShoppingIcon from '@/src/assets/icons/category/shopping.svg';
import ExerciseIcon from '@/src/assets/icons/category/exercise.svg';
import CareerIcon from '@/src/assets/icons/category/career.svg';
import StudyIcon from '@/src/assets/icons/category/study.svg';
import TipsIcon from '@/src/assets/icons/category/tips.svg';
import EtcIcon from '@/src/assets/icons/category/etc.svg';

/** 카테고리 타입 정의 */
export type CategoryType =
  | 'food'
  | 'hobby'
  | 'travel'
  | 'money'
  | 'shopping'
  | 'exercise'
  | 'career'
  | 'study'
  | 'tips'
  | 'etc';

/** 카테고리 아이템 정의 */
interface CategoryItem {
  id: CategoryType;
  label: string;
  Icon: React.FC<{ width: number; height: number }>;
}

/** 카테고리 목록 */
const CATEGORIES: CategoryItem[] = [
  { id: 'food', label: '맛집', Icon: FoodIcon },
  { id: 'hobby', label: '취미', Icon: HobbyIcon },
  { id: 'travel', label: '여행', Icon: TravelIcon },
  { id: 'money', label: '재테크', Icon: MoneyIcon },
  { id: 'shopping', label: '쇼핑', Icon: ShoppingIcon },
  { id: 'exercise', label: '운동', Icon: ExerciseIcon },
  { id: 'career', label: '커리어', Icon: CareerIcon },
  { id: 'study', label: '자기계발', Icon: StudyIcon },
  { id: 'tips', label: '꿀팁', Icon: TipsIcon },
  { id: 'etc', label: '기타', Icon: EtcIcon },
];

/** Props 타입 정의 */
interface AddCollectionViewProps {
  onBack: () => void;
  onAdd?: (name: string, category: CategoryType) => void;
  name: string;
  onNameChange: (name: string) => void;
  selectedCategory: CategoryType | null;
  onCategoryChange: (category: CategoryType) => void;
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
  const handleCategorySelect = (categoryId: CategoryType) => {
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
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center gap-2 px-5 pb-5">
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <BackIcon width={36} height={36} />
        </TouchableOpacity>
        <Text className="text-heading-xl text-black">모음 추가</Text>
      </View>

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
            {CATEGORIES.slice(0, 5).map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onPress={() => handleCategorySelect(category.id)}
              />
            ))}
          </View>

          {/* 두 번째 줄: 운동, 커리어, 자기계발, 꿀팁, 기타 */}
          <View className="flex-row justify-between">
            {CATEGORIES.slice(5, 10).map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onPress={() => handleCategorySelect(category.id)}
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
    </View>
  );
}

/** 카테고리 버튼 컴포넌트 */
interface CategoryButtonProps {
  category: CategoryItem;
  isSelected: boolean;
  onPress: () => void;
}

function CategoryButton({
  category,
  isSelected,
  onPress,
}: CategoryButtonProps) {
  const { Icon, label } = category;

  return (
    <TouchableOpacity
      className="w-[54px] items-center"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        className={`mb-1.5 overflow-hidden rounded-full ${
          isSelected ? 'border-2 border-point' : ''
        }`}
      >
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
