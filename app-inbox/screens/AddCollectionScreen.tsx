import { useCallback, useState } from 'react';
import { AppInboxAddCollectionStackScreenProps } from '../types';
import InboxBottomSheet from 'app-inbox/components/InboxBottomSheet';
import Button from '../components/Button';
import AddCollectionView from '@/src/components/AddCollectionView';
import { useCreateCollect } from '@/src/api/generated/endpoints/collection/collection';
import { CollectionCreateRequestCategory } from '@/src/api/generated/models/collectionCreateRequestCategory';
import { ArchiveCategory } from '@/src/constants/category';
import { useInboxBottomSheet } from 'app-inbox/components/InboxBottomSheet/context';
import { useFocusEffect } from 'expo-router';

export default function AddCollectionScreen({
  navigation,
}: AppInboxAddCollectionStackScreenProps) {
  const { setFitHeight } = useInboxBottomSheet();
  const [category, setCategory] = useState<ArchiveCategory | null>(null);
  const [name, setName] = useState('');
  const { mutate: createCollect } = useCreateCollect();

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
        onSuccess: () => navigation.goBack(),
        onError: (error) => console.error(error),
      },
    );
  };

  useFocusEffect(
    useCallback(() => {
      setFitHeight();
    }, []),
  );

  return (
    <InboxBottomSheet.Layout>
      <AddCollectionView
        selectedCategory={category}
        onCategoryChange={setCategory}
        name={name}
        onNameChange={setName}
        onAdd={handleAdd}
      />
      <InboxBottomSheet.Footer>
        <Button>
          <Button.Text>추가</Button.Text>
        </Button>
      </InboxBottomSheet.Footer>
    </InboxBottomSheet.Layout>
  );
}
