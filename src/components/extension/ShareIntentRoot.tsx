import React, { useState, useEffect } from 'react';
import { View, BackHandler, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import CollectionBottomSheet from '../CollectionBottomSheet';
import type { ShareIntentData } from '../../types/shareIntent';

/**
 * Android ShareActivity용 wrapper 컴포넌트
 */
export function ShareIntentRoot(props: ShareIntentData) {
  const [modalVisible, setModalVisible] = useState(false);
  const [shareIntent, setShareIntent] = useState<ShareIntentData | null>(null);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (props.text || props.url || props.title) {
      // TODO thunbnail 처리 백엔드와 협의 후 수정
      setShareIntent({
        text: props.text || null,
        type: props.type || 'text',
        title: props.title || null,
        url: props.url || null,
        thumbnailUrl: props.thumbnailUrl || null,
      });
      setModalVisible(true);
    }
  }, [props.text, props.title, props.url, props.thumbnailUrl, props.type]);

  const handleClose = () => {
    setModalVisible(false);
    BackHandler.exitApp();
  };

  const handleConfirm = () => {
    console.log('공유 데이터 저장:', shareIntent);
    handleClose();
  };

  const handleSelectCollection = (collectionId: string) => {
    console.log('선택된 컬렉션:', collectionId);
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

  const handleAddCollection = () => {
    console.log('모음 추가 버튼 클릭');
    // TODO: 모음 추가 로직 구현
  };

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-transparent">
        <KeyboardProvider>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />

          {/* TODO 여기가 dim이면 되는거 아닌가? */}
          <CollectionBottomSheet
            visible={modalVisible}
            onClose={handleClose}
            onClickAddCollection={handleAddCollection}
            onSelect={handleSelectCollection}
            shareIntent={shareIntent}
            isShareMode={true}
          />
        </KeyboardProvider>
      </View>
    </SafeAreaProvider>
  );
}
