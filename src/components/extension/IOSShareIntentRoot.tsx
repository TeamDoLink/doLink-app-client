import React, { useState, useEffect } from 'react';
import { View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import CollectionBottomSheet from '../CollectionBottomSheet';
import type { IOSShareExtensionData } from '../../types/shareIntent';

// expo-share-extension은 iOS 전용이므로 조건부 import
const closeShareExtension =
  Platform.OS === 'ios' ? require('expo-share-extension').close : () => {};

/**
 * iOS Share Extension용 wrapper 컴포넌트
 */
export function IOSShareIntentRoot(props: IOSShareExtensionData) {
  const [modalVisible, setModalVisible] = useState(false);
  const [shareIntent, setShareIntent] = useState<any>(null);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // iOS에서 전달받은 데이터를 ShareIntent 형식으로 변환
    if (props.url || props.text || props.preprocessingResults) {
      const webUrl = props.url || props.preprocessingResults?.baseURI || null;
      const title = (props.preprocessingResults?.title as string) || null;

      const data = {
        text: props.text || null,
        meta: title ? { title } : null,
        type: props.url || props.preprocessingResults ? 'weburl' : 'text',
        files: null,
        webUrl,
      };

      setShareIntent(data);
      console.log('iOS Share Intent Data:', data);
      setModalVisible(true);
    }
  }, [props.url, props.text, props.preprocessingResults]);

  const handleClose = () => {
    setModalVisible(false);
    closeShareExtension();
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
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <CollectionBottomSheet
            visible={modalVisible}
            onClose={handleClose}
            onSelect={handleSelectCollection}
            shareIntent={shareIntent}
            isShareMode={true}
          />
        </KeyboardProvider>
      </SafeAreaProvider>
    </View>
  );
}
