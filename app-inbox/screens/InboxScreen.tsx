import { AppInboxStackScreenProps } from '../types';
import { useState } from 'react';
import InboxBottomSheet from '@/src/components/InboxBottomSheet';
import { FlatList, View } from 'react-native';
import { closeShareOrExitApp } from '@/src/utils/closeShareOrExitApp';
import ArchiveSocialMediaListItem from '@/src/components/ArchiveSocialMediaListItem';
import SearchInputField from '@/src/components/common/inputField/searchInputField';
import Button from '@/src/components/common/Button';
import { useListAll1 } from '@/src/api/generated/endpoints/collection/collection';
import { useCreate } from '@/src/api/generated/endpoints/task/task';
import { ApiResponseSliceCollectionResponse } from '@/src/api/generated/models';
import { useShareIntent } from '@/src/components/SharedIntent';
import TextInput from '@/src/components/common/inputField/TextInput';

export default function InboxScreen({
  navigation,
}: AppInboxStackScreenProps<'Inbox'>) {
  const { data: collections } =
    useListAll1<ApiResponseSliceCollectionResponse>();
  const { shareIntent } = useShareIntent();
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);
  const [searchText, setSearchText] = useState('');
  const [memo, setMemo] = useState<string>('');
  const { mutate: createTask } = useCreate();

  const handleAddTask = () => {
    if (!shareIntent?.text || !selectedCollectionId) {
      return;
    }
    createTask(
      {
        data: {
          title: shareIntent.title ?? '',
          collectionId: selectedCollectionId ?? 0,
          memo: memo,
          link: shareIntent.url ?? '',
        },
      },
      {
        onSuccess: () => {
          closeShareOrExitApp(!!shareIntent);
        },
        onError: (error) => {
          console.error(error);
        },
      },
    );
  };

  const handleSelect = (collectionId?: number) => {
    setSelectedCollectionId((prev) =>
      prev === collectionId ? null : (collectionId ?? null),
    );
  };

  return (
    <InboxBottomSheet.Layout>
      <InboxBottomSheet.Content className="flex-1">
        <View className="px-5 pb-3">
          <TextInput className="mb-5">
            <TextInput.Input
              placeholder="메모를 입력해보세요."
              value={memo}
              onChangeText={setMemo}
            />
          </TextInput>
          <SearchInputField value={searchText} onChangeText={setSearchText} />
        </View>
        <FlatList
          className="flex-1"
          data={collections?.result?.content ?? []}
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
      </InboxBottomSheet.Content>
      <InboxBottomSheet.Footer>
        <Button onPress={handleAddTask}>
          <Button.Text>할일 담기</Button.Text>
        </Button>
      </InboxBottomSheet.Footer>
    </InboxBottomSheet.Layout>
  );
}
