import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, BackHandler, StatusBar, StyleSheet } from 'react-native';
import CollectionBottomSheet from '@/src/components/CollectionBottomSheet';
import type { ShareIntent } from 'expo-share-intent';

/**
 * Android 공유 deeplink 처리용 라우트
 * dolink://share?text=...&title=...&url=...&thumbnail=... 형태로 들어옴
 */
export default function ShareRoute() {
  const params = useLocalSearchParams<{
    text: string;
    title: string;
    url: string;
    thumbnail: string;
  }>();
  const [modalVisible, setModalVisible] = useState(false);
  const [shareIntent, setShareIntent] = useState<ShareIntent | null>(null);

  // TODO 이미지 파일 처리 백엔드와 협의 필요
  useEffect(() => {
    if (params.text || params.url || params.thumbnail) {
      console.log('공유 데이터 수신:', params);

      setShareIntent({
        text: params.text || null,
        meta: {
          title: params.title,
          url: params.url,
          thumbnail: params.thumbnail,
        },
        files: null,
        webUrl: params.url || null,
        type: params.url ? 'weburl' : params.thumbnail ? 'file' : 'text',
      });
      setModalVisible(true);
    }
  }, [params.text, params.title, params.url, params.thumbnail]);

  const handleClose = () => {
    setModalVisible(false);
    // 공유 완료 후 앱 종료
    BackHandler.exitApp();
  };

  const handleConfirm = async () => {
    // TODO: 서버 API 호출
    // await fetch(`${config.apiUrl}/api/links`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     url: shareIntent?.text,
    //     title: shareIntent?.meta?.title,
    //   }),
    // });

    console.log('공유 데이터 저장:', shareIntent);
    handleClose();
  };

  const handleSelectCollection = (collectionId: string) => {
    console.log('선택된 컬렉션:', collectionId);
    handleConfirm();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <CollectionBottomSheet
        visible={modalVisible}
        onClose={handleClose}
        onSelect={handleSelectCollection}
        shareIntent={shareIntent}
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
