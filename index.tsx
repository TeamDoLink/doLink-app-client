import React from 'react';
import { AppRegistry, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { View, BackHandler, StatusBar, StyleSheet, Text } from 'react-native';
import 'expo-router/entry';
import CollectionBottomSheet from './src/components/CollectionBottomSheet';
import type {
  ShareIntentData,
  IOSShareExtensionData,
} from './src/types/shareIntent';

import { close as closeShareExtension } from 'expo-share-extension';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';

// 이거 하니까 안 깨진다..
// IOSShareIntentRoot가 있는 파일 최상단
import './src/styles/global.css';
import './src/lib/nativewind-setup';

// Android ShareActivity용 wrapper 컴포넌트
function ShareIntentRoot(props: ShareIntentData) {
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

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <KeyboardProvider>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />

          <CollectionBottomSheet
            visible={modalVisible}
            onClose={handleClose}
            onSelect={handleSelectCollection}
            shareIntent={shareIntent}
            isShareMode={true}
          />
        </KeyboardProvider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

// iOS Share Extension용 wrapper 컴포넌트
function IOSShareIntentRoot(props: IOSShareExtensionData) {
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
          {/* 1. 최상위는 무조건 투명해야 뒤(사파리)가 보입니다. */}

          {/* CollectionBottomSheet가 자체 overlay를 가지고 있으므로 여기서는 터치 차단하지 않음 */}
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

if (Platform.OS === 'android') {
  AppRegistry.registerComponent('share-intent', () => ShareIntentRoot);
} else {
  AppRegistry.registerComponent('shareExtension', () => IOSShareIntentRoot);
}
