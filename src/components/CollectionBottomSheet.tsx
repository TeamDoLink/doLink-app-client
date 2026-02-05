/**
 * CollectionBottomSheet
 * 컬렉션 목록을 보여주고 선택할 수 있는 바텀시트 컴포넌트
 * - 슬라이드 업/다운 애니메이션 지원
 * - 검색 필터링 기능 포함
 * - 키보드 위에 고정되는 하단 버튼 제공
 */
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Keyboard,
  Platform,
} from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArchiveSocialMediaListItem from './common/list/ArchiveSocialMediaListItem';
import { TodoBottomSheet } from './common/bottomSheet/todoBottomSheet';
import SearchInputField from './common/inputField/searchInputField';
import { ShareIntentData } from '../types/shareIntent';

/** 컬렉션 아이템 타입 정의 */
interface CollectionItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  itemCount: number;
}

/** 바텀시트 Props 타입 정의 */
interface CollectionBottomSheetProps {
  visible: boolean; // 바텀시트 표시 여부
  onClose: () => void; // 닫기 콜백
  onSelect?: (collectionId: string) => void; // 컬렉션 선택 콜백
  selectedItems?: string[]; // 선택된 아이템 ID 목록
  shareIntent?: ShareIntentData | null; // 공유 인텐트 데이터
  isShareMode?: boolean; // 공유 모드 여부
}

const DUMMY_COLLECTIONS: CollectionItem[] = [
  {
    id: '1',
    title: '읽을 사항을 숨겨진 구성원이 사용을 옷찰락',
    description: '디자인 · 나중에 읽음',
    thumbnail: 'https://picsum.photos/seed/1/150',
    itemCount: 12,
  },
  {
    id: '2',
    title: '성장하는 개발자를 위한 기술 스택 모음',
    description: '개발 · 기술 블로그',
    thumbnail: 'https://picsum.photos/seed/2/150',
    itemCount: 8,
  },
  {
    id: '3',
    title: '주말에 가기 좋은 감성 카페 리스트',
    description: '여행 · 카페',
    thumbnail: 'https://picsum.photos/seed/3/150',
    itemCount: 15,
  },
  {
    id: '4',
    title: '미니멀리즘 인테리어 영감 모음집',
    description: '인테리어 · 리빙',
    thumbnail: 'https://picsum.photos/seed/4/150',
    itemCount: 5,
  },
  {
    id: '5',
    title: '효율적인 업무를 위한 생산성 도구',
    description: '업무 · 생산성',
    thumbnail: 'https://picsum.photos/seed/5/150',
    itemCount: 20,
  },
  {
    id: '6',
    title: '2024년 꼭 들어야 할 플레이리스트',
    description: '음악 · 취미',
    thumbnail: 'https://picsum.photos/seed/6/150',
    itemCount: 32,
  },
  {
    id: '7',
    title: 'React Native 성능 최적화 가이드',
    description: '개발 · 모바일',
    thumbnail: 'https://picsum.photos/seed/7/150',
    itemCount: 11,
  },
  {
    id: '8',
    title: '심플하고 정갈한 자취 요리 레시피',
    description: '요리 · 레시피',
    thumbnail: 'https://picsum.photos/seed/8/150',
    itemCount: 45,
  },
  {
    id: '9',
    title: '매일 아침 10분 스트레칭 루틴',
    description: '건강 · 운동',
    thumbnail: 'https://picsum.photos/seed/9/150',
    itemCount: 7,
  },
  {
    id: '10',
    title: '글로벌 비즈니스 영어 핵심 패턴',
    description: '교육 · 외국어',
    thumbnail: 'https://picsum.photos/seed/10/150',
    itemCount: 18,
  },
  {
    id: '11',
    title: '데이터 분석 입문자를 위한 추천 도서',
    description: '데이터 · 도서',
    thumbnail: 'https://picsum.photos/seed/11/150',
    itemCount: 9,
  },
  {
    id: '12',
    title: '가을 겨울 시즌 데일리 룩북',
    description: '패션 · 스타일',
    thumbnail: 'https://picsum.photos/seed/12/150',
    itemCount: 24,
  },
  {
    id: '13',
    title: '마음의 평화를 위한 명상 가이드',
    description: '심리 · 명상',
    thumbnail: 'https://picsum.photos/seed/13/150',
    itemCount: 13,
  },
  {
    id: '14',
    title: '세계 곳곳의 숨겨진 트래킹 코스',
    description: '여행 · 액티비티',
    thumbnail: 'https://picsum.photos/seed/14/150',
    itemCount: 21,
  },
  {
    id: '15',
    title: '경제적 자유를 위한 투자 기초 지식',
    description: '경제 · 투자',
    thumbnail: 'https://picsum.photos/seed/15/150',
    itemCount: 30,
  },
];

export default function CollectionBottomSheet({
  visible,
  onClose,
  onSelect,
  selectedItems: initialSelectedItems = [],
}: CollectionBottomSheetProps) {
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  // 오버레이 페이드 애니메이션
  const opacity = useRef(new Animated.Value(0)).current;

  // 키보드 상태 관리
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // 검색 상태 관리
  const [searchText, setSearchText] = useState('');
  const [filteredCollections, setFilteredCollections] =
    useState(DUMMY_COLLECTIONS);

  // 선택 상태 관리
  const [selectedItems, setSelectedItems] =
    useState<string[]>(initialSelectedItems);

  // 키보드 이벤트 리스너
  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showListener = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true);
    });
    const hideListener = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  // 검색어 변경 시 컬렉션 목록 필터링
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredCollections(DUMMY_COLLECTIONS);
    } else {
      const filtered = DUMMY_COLLECTIONS.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredCollections(filtered);
    }
  }, [searchText]);

  // visible 상태 변경 시 오버레이 페이드 애니메이션
  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setSearchText(''); // 닫힐 때 검색어 초기화
      });
    }
  }, [visible, opacity]);

  /** 컬렉션 선택 핸들러 */
  const handleSelectCollection = (id: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
    onSelect?.(id);
  };

  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-[9999]" pointerEvents="auto">
      {/* 오버레이 */}
      <Animated.View
        className="absolute inset-0 bg-black/50"
        style={{ opacity }}
        onTouchEnd={onClose}
      />

      {/* BottomSheet */}
      <View className="absolute bottom-0 left-0 right-0 bg-transparent">
        <TodoBottomSheet
          expandable={true}
          onClickAddCollection={() => {}}
          onClose={onClose}
        >
          {/* 검색 */}
          <View className="px-5 pb-3">
            <SearchInputField value={searchText} onChangeText={setSearchText} />
          </View>

          {/* 컬렉션 목록 */}
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {filteredCollections.map((item, index) => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <ArchiveSocialMediaListItem
                  key={item.id}
                  title={item.title}
                  category="카테고리"
                  itemCount={item.itemCount}
                  thumbnail={item.thumbnail}
                  isSelected={isSelected}
                  onPress={() => handleSelectCollection(item.id)}
                  showDivider={index < filteredCollections.length - 1}
                />
              );
            })}
          </ScrollView>
        </TodoBottomSheet>
      </View>

      {/* 하단 버튼 영역 - 키보드 위에 고정 */}
      <View
        className="absolute left-0 right-0"
        style={{ bottom: isKeyboardVisible ? 0 : safeAreaBottom }}
      >
        <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
          <View className="bg-white px-5 py-4">
            <TouchableOpacity
              className={`items-center justify-center rounded-[12px] py-[14px] ${
                selectedItems.length > 0 ? 'bg-point' : 'bg-grey-50'
              }`}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text
                className={`text-center text-body-xl ${
                  selectedItems.length > 0 ? 'text-white' : 'text-grey-400'
                }`}
              >
                담기
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardStickyView>
      </View>
    </View>
  );
}
