import { AppInboxAddCollectionStackScreenProps } from '../types';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import InboxBottomSheet from 'app-inbox/components/InboxBottomSheet';
import { FlatList, TouchableOpacity, Text, View } from 'react-native';
import Button from '../components/Button';
import { useListAll1 } from '@/src/api/generated/endpoints/collection/collection';
import { ApiResponseSliceCollectionResponse } from '@/src/api/generated/models/apiResponseSliceCollectionResponse';
import ArchiveSocialMediaListItem from '@/src/components/common/list/ArchiveSocialMediaListItem';
import SearchInputField from '@/src/components/common/inputField/searchInputField';
import PlusIcon from '@/src/assets/icons/common/plus.svg';

export default function InboxScreen({
  navigation,
}: AppInboxAddCollectionStackScreenProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);
  const [searchText, setSearchText] = useState('');
  const { data: collections } = useListAll1<
    ApiResponseSliceCollectionResponse,
    Error
  >();

  const handleSelect = (collectionId?: number) => {
    setSelectedCollectionId((prev) =>
      prev === collectionId ? null : (collectionId ?? null),
    );
  };

  return (
    <InboxBottomSheet
      steps={[40, 70, 100]}
      header={
        <InboxBottomSheet.Header
          title="할일 담기"
          RightContent={
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('AddCollection')}
              className="flex-row items-center gap-0.5"
            >
              <PlusIcon width={16} height={16} color="#4E5968" />
              <Text className="text-caption-md text-grey-700">모음 추가</Text>
            </TouchableOpacity>
          }
        />
      }
      content={
        <InboxBottomSheet.Layout>
          <View className="px-5 pb-3">
            <SearchInputField value={searchText} onChangeText={setSearchText} />
          </View>
          <FlatList
            data={collections?.result?.content}
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
        </InboxBottomSheet.Layout>
      }
      footer={
        <InboxBottomSheet.Footer>
          <Button>
            <Button.Text>할일 담기</Button.Text>
          </Button>
        </InboxBottomSheet.Footer>
      }
    />
  );
}
