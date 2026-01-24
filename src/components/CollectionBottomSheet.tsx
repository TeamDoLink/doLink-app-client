import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  TextInput,
  Platform,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import type { ShareIntent } from 'expo-share-intent';
import ArchiveSocialMediaListItem from './common/list/ArchiveSocialMediaListItem';
import { TodoBottomSheet } from './common/bottomSheet/todoBottomSheet';
import SearchInputField from './common/inputField/searchInputField';

const BOTTOM_SHEET_HEIGHT = 500;

interface CollectionItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  itemCount: number;
}

interface CollectionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect?: (collectionId: string) => void;
  selectedItems?: string[];
  shareIntent?: ShareIntent | null;
  isShareMode?: boolean;
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
  selectedItems = [],
  shareIntent = null,
  isShareMode = false,
}: CollectionBottomSheetProps) {
  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [searchText, setSearchText] = useState('');
  const [filteredCollections, setFilteredCollections] =
    useState(DUMMY_COLLECTIONS);

  // 검색 필터링
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

  // 애니메이션
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: BOTTOM_SHEET_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setSearchText('');
      });
    }
  }, [visible, translateY, opacity]);

  const handleSelectCollection = (id: string) => {
    console.log('선택된 컬렉션:', id);
    onSelect?.(id);
  };

  if (!visible) return null;

  return (
    <View style={styles.fullScreen} pointerEvents="auto">
      {/* 오버레이 */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity,
          },
        ]}
        onTouchEnd={onClose}
      />

      {/* BottomSheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <TodoBottomSheet onClickAddCollection={() => {}} onClose={onClose}>
          {/* 검색 */}
          <SearchInputField />

          {/* 컬렉션 목록 */}
          <ScrollView
            style={styles.listContainer}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
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

        {/* 닫기 버튼 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>담기</Text>
          </TouchableOpacity>
          <View style={styles.footerHandle} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
  },

  // 핸들 바
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#D0D0D0',
    borderRadius: 2,
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  addButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },

  // 검색
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#efefef',
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    paddingVertical: 0,
  },

  // 공유 정보
  shareInfoContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  shareUrl: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  shareText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },

  // 리스트
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 6,
  },

  // 푸터
  footer: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    marginBottom: 8,
    alignItems: 'center',
    borderRadius: 0,
  },
  closeButtonText: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
  },
  footerHandle: {
    width: 100,
    height: 3,
    backgroundColor: '#000000',
    borderRadius: 1.5,
    alignSelf: 'center',
  },
});
