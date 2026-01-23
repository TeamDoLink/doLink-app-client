import React from 'react';
import { AppRegistry } from 'react-native';
import { useState, useEffect } from 'react';
import { View, BackHandler, StatusBar, StyleSheet } from 'react-native';
import 'expo-router/entry';
import ShareIntentModal from './src/components/ShareIntentModal';
import type { ShareIntentData } from './src/types/shareIntent';
import type { ShareIntent } from 'expo-share-intent';

// Android ShareActivity용 wrapper 컴포넌트
function ShareIntentRoot(props: ShareIntentData) {
  const [modalVisible, setModalVisible] = useState(false);
  const [shareIntent, setShareIntent] = useState<ShareIntent | null>(null);

  useEffect(() => {
    if (props.text || props.url || props.title) {
      // TODO thunbnail 처리 백엔드와 협의 후 수정
      setShareIntent({
        text: props.text || null,
        meta: props.title ? { title: props.title } : null,
        type: props.type || 'text',
        files: null,
        webUrl: props.url || null,
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

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ShareIntentModal
        visible={modalVisible}
        shareIntent={shareIntent}
        onClose={handleClose}
        onConfirm={handleConfirm}
        isShareMode={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

// Android ShareActivity용 컴포넌트 등록
AppRegistry.registerComponent('share-intent', () => ShareIntentRoot);
