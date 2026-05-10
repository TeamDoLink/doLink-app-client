import { useCallback, useState } from 'react';
import { AppInboxAddCollectionStackScreenProps } from '../types';
import InboxBottomSheet from '@/src/components/InboxBottomSheet';
import Button from '@/src/components/common/Button';
import AddCollectionView from '@/src/components/AddCollectionView';
import { useCreateCollect } from '@/src/api/generated/endpoints/collection/collection';
import { getSearchCollectionsQueryKey } from '@/src/api/generated/endpoints/search/search';
import { CollectionCreateRequestCategory } from '@/src/api/generated/models/collectionCreateRequestCategory';
import {
  ArchiveCategory,
  ARCHIVE_CATEGORY_LABEL,
} from '@/src/constants/category';
import { useInboxBottomSheet } from '@/src/components/InboxBottomSheet/context';
import { useFocusEffect } from '@react-navigation/native';
import InboxLoading, { InboxLoadingProps } from '@/src/components/InboxLoading';
import useRQLoadingStatus from '@/src/components/InboxLoading/useRQLoadingStatus';
import { useQueryClient } from '@tanstack/react-query';

export default function AddCollectionScreenAndroid({
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
          category: ARCHIVE_CATEGORY_LABEL[
            category
          ] as CollectionCreateRequestCategory,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getSearchCollectionsQueryKey(),
          });
          navigation.goBack();
        },
      },
    );
  };

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        setFitHeight();
      }, 100);
      return () => clearTimeout(timeout);
    }, [setFitHeight]),
  );

  const loadingStatus = useRQLoadingStatus(status);

  const handleLoadingPress = (_status: InboxLoadingProps['status']) => {
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
