import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import CollectionBottomSheet from '@/src/components/CollectionBottomSheet';
import ArchiveSocialMediaListItem from '@/src/components/common/list/ArchiveSocialMediaListItem';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * CollectionBottomSheet 테스트 페이지
 *
 * 사용 방법:
 * 1. 앱에서 app/test 라우트로 이동
 * 2. "BottomSheet 열기" 버튼을 누르면 CollectionBottomSheet가 나타남
 * 3. 컬렉션 선택, 드래그, 검색 등을 테스트할 수 있음
 */
export default function TestBottomSheet() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const handleSelectCollection = (collectionId: string) => {
    setLastSelectedId(collectionId);
    if (selectedCollections.includes(collectionId)) {
      setSelectedCollections(
        selectedCollections.filter((id) => id !== collectionId),
      );
    } else {
      setSelectedCollections([...selectedCollections, collectionId]);
    }
    console.log('선택된 컬렉션:', collectionId);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← 뒤로가기</Text>
        </TouchableOpacity>
        <Text style={styles.title}>BottomSheet 테스트</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* 테스트 콘텐츠 */}
      <ScrollView style={styles.content}>
        {/* CollectionListItem 테스트 */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            ArchiveSocialMediaListItem 컴포넌트
          </Text>
          <View style={{ marginHorizontal: -16, marginTop: 8 }}>
            <ArchiveSocialMediaListItem
              title="모음 이름 공백 포함 최대 19글자 후 말줄임"
              category="카테고리"
              itemCount={5}
              thumbnail="https://picsum.photos/200"
              isSelected={false}
              onPress={() => console.log('item 1 pressed')}
            />
            <ArchiveSocialMediaListItem
              title="모음 선택된 상태 테스트"
              category="디자인"
              itemCount={12}
              thumbnail="https://picsum.photos/201"
              isSelected={true}
              highlightText="모음"
              onPress={() => console.log('item 2 pressed')}
            />
            <ArchiveSocialMediaListItem
              title="썸네일 없는 아이템"
              category="개발"
              itemCount={3}
              isSelected={false}
              showDivider={false}
              onPress={() => console.log('item 3 pressed')}
            />
          </View>
        </View>

        {/* 상태 정보 */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📊 테스트 상태</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>BottomSheet 상태:</Text>
            <Text style={styles.infoValue}>
              {visible ? '🟢 열림' : '🔴 닫힘'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>선택된 컬렉션 수:</Text>
            <Text style={styles.infoValue}>{selectedCollections.length}개</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>마지막 선택:</Text>
            <Text style={styles.infoValue}>
              {lastSelectedId ? `ID: ${lastSelectedId}` : '없음'}
            </Text>
          </View>
        </View>

        {/* 선택된 컬렉션 목록 */}
        {selectedCollections.length > 0 && (
          <View style={styles.selectedCard}>
            <Text style={styles.selectedTitle}>✅ 선택된 컬렉션</Text>
            {selectedCollections.map((id) => (
              <View key={id} style={styles.selectedItem}>
                <Text style={styles.selectedItemText}>ID: {id}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 테스트 설명 */}
        <View style={styles.descCard}>
          <Text style={styles.descTitle}>🧪 테스트 항목</Text>
          <Text style={styles.descText}>✓ 모달 열기/닫기</Text>
          <Text style={styles.descText}>✓ 컬렉션 선택 (체크박스)</Text>
          <Text style={styles.descText}>✓ 검색 기능 (텍스트 필터링)</Text>
          <Text style={styles.descText}>✓ 드래그 제스처 (높이 조절)</Text>
          <Text style={styles.descText}>✓ 수평 스크롤 (이미지)</Text>
          <Text style={styles.descText}>✓ "모음 추가" 버튼</Text>
        </View>
      </ScrollView>

      {/* 메인 테스트 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => setVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.openButtonText}>BottomSheet 열기</Text>
        </TouchableOpacity>

        {selectedCollections.length > 0 && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSelectedCollections([]);
              setLastSelectedId(null);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.resetButtonText}>선택 초기화</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* CollectionBottomSheet 컴포넌트 */}
      <CollectionBottomSheet
        visible={visible}
        onClose={() => setVisible(false)}
        onSelect={handleSelectCollection}
        selectedItems={selectedCollections}
        isShareMode={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // 정보 카드
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
  },

  // 선택된 컬렉션 카드
  selectedCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 12,
  },
  selectedItem: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  selectedItemText: {
    fontSize: 13,
    color: '#1a1a1a',
  },

  // 설명 카드
  descCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  descTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  descText: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },

  // 푸터 버튼들
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  openButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  openButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resetButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
});
