import { AppInboxStackScreenProps } from '../types';
import { useEffect, useMemo, useState } from 'react';
import InboxBottomSheet from '@/src/components/InboxBottomSheet';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { closeShareOrExitApp } from '@/src/utils/closeShareOrExitApp';
import ArchiveSocialMediaListItem from '@/src/components/ArchiveSocialMediaListItem';
import SearchInputField from '@/src/components/common/inputField/searchInputField';
import Button from '@/src/components/common/Button';
import { useCreate } from '@/src/api/generated/endpoints/task/task';
import { type CollectionResponse } from '@/src/api/generated/models';
import { useShareIntent } from '@/src/components/SharedIntent';
import TextInput from '@/src/components/common/inputField/TextInput';
import InboxLoading, { InboxLoadingProps } from '@/src/components/InboxLoading';
import useRQLoadingStatus from '@/src/components/InboxLoading/useRQLoadingStatus';
import {
  COLLECTION_PAGE_SIZE_DEFAULT,
  useSearchCollections,
} from '../hooks/useSearchCollections';

const COLLECTION_PAGE_SIZE = COLLECTION_PAGE_SIZE_DEFAULT;
const SEARCH_DEBOUNCE_MS = 1000;

export default function InboxScreen(_props: AppInboxStackScreenProps<'Inbox'>) {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [searchText]);

  const {
    data: searchData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useSearchCollections(debouncedSearchText, COLLECTION_PAGE_SIZE);

  const collectionRows = useMemo((): CollectionResponse[] => {
    return searchData?.pages.flatMap((p) => p.result?.content ?? []) ?? [];
  }, [searchData]);

  const { shareIntent } = useShareIntent();

  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);
  const [memo, setMemo] = useState<string>('');
  const { mutate: createTask, status, reset } = useCreate();

  const loadingStatus = useRQLoadingStatus(status);

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

  const handleLoadingPress = (status: InboxLoadingProps['status']) => {
    reset();
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
          {selectedCollectionId && (
            <TextInput className="mb-5">
              <TextInput.Input
                placeholder="메모를 입력해보세요."
                value={memo}
                onChangeText={setMemo}
              />
            </TextInput>
          )}
          <SearchInputField value={searchText} onChangeText={setSearchText} />
        </View>
        <FlatList
          className="flex-1"
          data={collectionRows}
          keyExtractor={(item) => String(item.collectionId ?? item.name)}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.35}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator />
              </View>
            ) : null
          }
          ListEmptyComponent={
            isPending ? (
              <View className="py-8">
                <ActivityIndicator />
              </View>
            ) : null
          }
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
      <InboxLoading status={loadingStatus} onPress={handleLoadingPress} />
    </InboxBottomSheet.Layout>
  );
}
