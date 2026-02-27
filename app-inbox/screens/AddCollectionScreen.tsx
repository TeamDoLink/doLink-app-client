import AddCollectionView from '@/src/components/AddCollectionView';
import { useNavigation } from '@react-navigation/native';
import { AppInboxAddCollectionStackScreenProps } from '../types';
import { useMutation } from '@tanstack/react-query';
import { useCreateCollect } from '@/src/api/generated/endpoints/collection/collection';
import { CollectionCreateRequestCategory } from '@/src/api/generated/models/collectionCreateRequestCategory';
import { useGetUser } from '@/src/api/generated/endpoints/user/user';
import { useState } from 'react';
import { ArchiveCategory } from '@/src/constants/category';

export default function AddCollectionScreen() {
  const { navigation } = useNavigation<AppInboxAddCollectionStackScreenProps>();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ArchiveCategory | null>(null);
  const { mutate: createCollect } = useCreateCollect();

  return (
    <AddCollectionView
      onBack={() => navigation.goBack()}
      onAdd={(name, category) =>
        createCollect(
          {
            data: {
              name,
              category: category as CollectionCreateRequestCategory,
            },
          },
          {
            onSuccess: () => {
              navigation.goBack();
            },
            onError: (error) => {
              console.error(error);
            },
          },
        )
      }
      name={name}
      onNameChange={(name) => {
        setName(name);
      }}
      selectedCategory={category}
      onCategoryChange={(category) => {
        setCategory(category);
      }}
    />
  );
}
