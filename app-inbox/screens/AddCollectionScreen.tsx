import { useCallback, useState } from 'react';
import { AppInboxAddCollectionStackScreenProps } from '../types';
import InboxBottomSheet from '@/src/components/InboxBottomSheet';
import Button from '@/src/components/common/Button';
import AddCollectionView from '@/src/components/AddCollectionView';
import {
  getListAll1QueryKey,
  useCreateCollect,
} from '@/src/api/generated/endpoints/collection/collection';
import { CollectionCreateRequestCategory } from '@/src/api/generated/models/collectionCreateRequestCategory';
import { ArchiveCategory } from '@/src/constants/category';
import { useInboxBottomSheet } from '@/src/components/InboxBottomSheet/context';
import { useFocusEffect } from '@react-navigation/native';
import InboxLoading, { InboxLoadingProps } from '@/src/components/InboxLoading';
import useRQLoadingStatus from '@/src/components/InboxLoading/useRQLoadingStatus';
import { useQueryClient } from '@tanstack/react-query';
import { getListAllQueryKey } from '@/src/api/generated/endpoints/task/task';

export default function AddCollectionScreen({
  navigation,
}: AppInboxAddCollectionStackScreenProps) {
  const { setFitHeight } = useInboxBottomSheet();
  const [category, setCategory] = useState<ArchiveCategory | null>(null);
  const [name, setName] = useState('');
  const { mutate: createCollect, status, reset } = useCreateCollect();

  const queryClient = useQueryClient();

  const handleAdd = () => {
    if (!category) return;
    createCollect(
      {
        data: {
          name: name,
          category: category as CollectionCreateRequestCategory,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAll1QueryKey() });
          navigation.goBack();
        },
        onError: (error) => console.error(error),
      },
    );
  };

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        setFitHeight();
      }, 100);
      return () => clearTimeout(timeout);
    }, []),
  );

  const loadingStatus = useRQLoadingStatus(status);

  const handleLoadingPress = (status: InboxLoadingProps['status']) => {
    reset();
  };

  return (
    <InboxBottomSheet.Layout>
      <InboxBottomSheet.Content>
        <AddCollectionView
          selectedCategory={category}
          onCategoryChange={setCategory}
          name={name}
          onNameChange={setName}
          hideButton
        />
      </InboxBottomSheet.Content>
      <InboxBottomSheet.Footer>
        <Button onPress={handleAdd}>
          <Button.Text>추가</Button.Text>
        </Button>
      </InboxBottomSheet.Footer>
      <InboxLoading status={loadingStatus} onPress={handleLoadingPress} />
    </InboxBottomSheet.Layout>
  );
}
