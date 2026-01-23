import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import type { ShareIntent } from 'expo-share-intent';

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
    description: '카테고리 · 읽을 나중',
    thumbnail: 'https://via.placeholder.com/64?text=Coll1',
    itemCount: 12,
  },
  {
    id: '2',
    title: '읽을 사항을 숨겨진 구성원이 사용을 옷찰락',
    description: '카테고리 · 읽을 나중',
    thumbnail: 'https://via.placeholder.com/64?text=Coll2',
    itemCount: 8,
  },
  {
    id: '3',
    title: '읽을 사항을 숨겨진 구성원이 사용을 옷찰락',
    description: '카테고리 · 읽을 나중',
    thumbnail: 'https://via.placeholder.com/64?text=Coll3',
    itemCount: 15,
  },
  {
    id: '4',
    title: '읽을 사항을 숨겨진 구성원이 사용을 옷찰락',
    description: '카테고리 · 읽을 나중',
    thumbnail: 'https://via.placeholder.com/64?text=Coll4',
    itemCount: 5,
  },
  {
    id: '5',
    title: '읽을 사항을 숨겨진 구성원이 사용을 옷찰락',
    description: '카테고리 · 읽을 나중',
    thumbnail: 'https://via.placeholder.com/64?text=Coll5',
    itemCount: 20,
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
        {/* 핸들 바 */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>할 일 담기</Text>
          <TouchableOpacity onPress={() => handleSelectCollection('new')}>
            <Text style={styles.addButton}>+ 모음 추가</Text>
          </TouchableOpacity>
        </View>

        {/* 검색 */}
        <View style={styles.searchContainer}>
          <AntDesign
            name="search1"
            size={16}
            color="#999999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="어느 모음에 담아볼까?"
            placeholderTextColor="#CCCCCC"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* 컬렉션 목록 */}
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredCollections.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.collectionItem}
                onPress={() => handleSelectCollection(item.id)}
                activeOpacity={0.7}
              >
                {/* 썸네일 */}
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />

                {/* 정보 */}
                <View style={styles.collectionInfo}>
                  <Text style={styles.collectionTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.collectionDesc} numberOfLines={1}>
                    {item.description}
                  </Text>
                </View>

                {/* 체크박스 */}
                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected,
                  ]}
                >
                  {isSelected && (
                    <AntDesign name="check" size={16} color="#007AFF" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

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
    maxHeight: BOTTOM_SHEET_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 15,
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
    paddingHorizontal: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },

  // 컬렉션 아이템
  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
    marginVertical: 4,
    backgroundColor: 'transparent',
    borderRadius: 0,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: '#E5E5E5',
  },
  collectionInfo: {
    flex: 1,
  },
  collectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  collectionDesc: {
    fontSize: 13,
    color: '#a0a0a0',
    fontWeight: '500',
  },

  // 체크박스
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
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
