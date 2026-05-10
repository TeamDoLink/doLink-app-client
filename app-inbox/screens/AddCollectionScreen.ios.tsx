import { useState } from 'react';
import { AppInboxAddCollectionStackScreenProps } from '../types';
import Button from '@/src/components/common/Button';
import AddCollectionView from '@/src/components/AddCollectionView';
import { useCreateCollect } from '@/src/api/generated/endpoints/collection/collection';
import { getSearchCollectionsQueryKey } from '@/src/api/generated/endpoints/search/search';
import { CollectionCreateRequestCategory } from '@/src/api/generated/models/collectionCreateRequestCategory';
import {
  ArchiveCategory,
  ARCHIVE_CATEGORY_LABEL,
} from '@/src/constants/category';
import InboxLoading, { InboxLoadingProps } from '@/src/components/InboxLoading';
import useRQLoadingStatus from '@/src/components/InboxLoading/useRQLoadingStatus';
import { useQueryClient } from '@tanstack/react-query';
import { KeyboardAvoidingView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddCollectionScreenIos({
  navigation,
}: AppInboxAddCollectionStackScreenProps) {
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

  const loadingStatus = useRQLoadingStatus(status);

  const handleLoadingPress = (_status: InboxLoadingProps['status']) => {
    reset();
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white">
      <View className="px-safe flex-1">
        <AddCollectionView
          selectedCategory={category}
          onCategoryChange={setCategory}
          name={name}
          onNameChange={setName}
          hideButton
        />
      </View>
      <SafeAreaView edges={['bottom']} className="bg-white">
        <View className="px-5 py-2">
          <Button onPress={handleAdd}>
            <Button.Text>추가</Button.Text>
          </Button>
        </View>
      </SafeAreaView>
      <InboxLoading status={loadingStatus} onPress={handleLoadingPress} />
    </KeyboardAvoidingView>
  );
}
