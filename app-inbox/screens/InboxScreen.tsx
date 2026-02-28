import { AppInboxAddCollectionStackScreenProps } from '../types';
import { useState } from 'react';
import InboxBottomSheet from 'app-inbox/components/InboxBottomSheet';
import { FlatList, View } from 'react-native';
import ArchiveSocialMediaListItem from '@/src/components/common/list/ArchiveSocialMediaListItem';
import SearchInputField from '@/src/components/common/inputField/searchInputField';
import Button from 'app-inbox/components/Button';

/** ArchiveSocialMediaListItem 테스트용 모킹 데이터 */
const MOCK_COLLECTIONS = [
  {
    collectionId: 1,
    name: '서울 맛집 리스트',
    category: '맛집',
    taskCount: 12,
    thumbnails: ['https://picsum.photos/seed/1/88/88'] as string[],
  },
  {
    collectionId: 2,
    name: '주말에 할 취미',
    category: '취미',
    taskCount: 5,
    thumbnails: ['https://picsum.photos/seed/2/88/88'] as string[],
  },
  {
    collectionId: 3,
    name: '제주도 여행 계획',
    category: '여행',
    taskCount: 8,
    thumbnails: [] as string[],
  },
  {
    collectionId: 4,
    name: '투자 공부',
    category: '재테크',
    taskCount: 3,
    thumbnails: ['https://picsum.photos/seed/4/88/88'] as string[],
  },
  {
    collectionId: 5,
    name: '살 것 목록',
    category: '쇼핑',
    taskCount: 0,
    thumbnails: [] as string[],
  },
  {
    collectionId: 6,
    name: '홍대 카페 투어',
    category: '맛집',
    taskCount: 7,
    thumbnails: ['https://picsum.photos/seed/6/88/88'] as string[],
  },
  {
    collectionId: 7,
    name: '요가 & 스트레칭',
    category: '운동',
    taskCount: 4,
    thumbnails: [] as string[],
  },
  {
    collectionId: 8,
    name: '이직 준비 자료',
    category: '커리어',
    taskCount: 15,
    thumbnails: ['https://picsum.photos/seed/8/88/88'] as string[],
  },
  {
    collectionId: 9,
    name: '영어 회화 공부',
    category: '자기개발',
    taskCount: 6,
    thumbnails: ['https://picsum.photos/seed/9/88/88'] as string[],
  },
  {
    collectionId: 10,
    name: '생활 꿀팁 모음',
    category: '꿀팁',
    taskCount: 22,
    thumbnails: [] as string[],
  },
  {
    collectionId: 11,
    name: '부산 맛집',
    category: '맛집',
    taskCount: 9,
    thumbnails: ['https://picsum.photos/seed/11/88/88'] as string[],
  },
  {
    collectionId: 12,
    name: '그림 그리기',
    category: '취미',
    taskCount: 2,
    thumbnails: [] as string[],
  },
  {
    collectionId: 13,
    name: '동남아 배낭여행',
    category: '여행',
    taskCount: 11,
    thumbnails: ['https://picsum.photos/seed/13/88/88'] as string[],
  },
  {
    collectionId: 14,
    name: '예금·적금 비교',
    category: '재테크',
    taskCount: 5,
    thumbnails: [] as string[],
  },
  {
    collectionId: 15,
    name: '가전제품 구매',
    category: '쇼핑',
    taskCount: 1,
    thumbnails: ['https://picsum.photos/seed/15/88/88'] as string[],
  },
  {
    collectionId: 16,
    name: '러닝 기록',
    category: '운동',
    taskCount: 18,
    thumbnails: [] as string[],
  },
  {
    collectionId: 17,
    name: '포트폴리오 정리',
    category: '커리어',
    taskCount: 4,
    thumbnails: ['https://picsum.photos/seed/17/88/88'] as string[],
  },
  {
    collectionId: 18,
    name: '독서 목록',
    category: '자기개발',
    taskCount: 10,
    thumbnails: [] as string[],
  },
  {
    collectionId: 19,
    name: '앱 추천 리스트',
    category: '꿀팁',
    taskCount: 14,
    thumbnails: ['https://picsum.photos/seed/19/88/88'] as string[],
  },
  {
    collectionId: 20,
    name: '기타 메모',
    category: '기타',
    taskCount: 0,
    thumbnails: [] as string[],
  },
];

export default function InboxScreen({
  navigation,
}: AppInboxAddCollectionStackScreenProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);
  const [searchText, setSearchText] = useState('');

  const handleSelect = (collectionId?: number) => {
    setSelectedCollectionId((prev) =>
      prev === collectionId ? null : (collectionId ?? null),
    );
  };

  return (
    <InboxBottomSheet.Layout>
      <View className="px-5 pb-3">
        <SearchInputField value={searchText} onChangeText={setSearchText} />
      </View>
      <FlatList
        className="flex-1"
        data={MOCK_COLLECTIONS}
        renderItem={({ item }) => (
          <ArchiveSocialMediaListItem
            title={item.name ?? ''}
            category={item.category ?? ''}
            itemCount={item.taskCount ?? 0}
            thumbnail={item.thumbnails?.[0] ?? ''}
            isSelected={selectedCollectionId === item.collectionId}
            onPress={() => handleSelect(item.collectionId)}
          />
        )}
      />
      <InboxBottomSheet.Footer>
        <Button>
          <Button.Text>할일 담기</Button.Text>
        </Button>
      </InboxBottomSheet.Footer>
    </InboxBottomSheet.Layout>
  );
}
