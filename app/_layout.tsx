import '../src/styles/global.css';
import { useState, useEffect } from 'react';
import { View, BackHandler, Platform, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useShareIntent, ShareIntent } from 'expo-share-intent';
import ShareIntentModal from '@/src/components/ShareIntentModal';

export default function RootLayout() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIntent, setCurrentIntent] = useState<ShareIntent | null>(null);
  const [isShareMode, setIsShareMode] = useState(false);

  // iOS: expo-share-intent 사용
  // Android: app/share.tsx에서 처리 (deeplink 라우팅)
  const { shareIntent, resetShareIntent } = useShareIntent({
    debug: __DEV__,
    resetOnBackground: true,
    disabled: Platform.OS === 'android',
  });

  // iOS: expo-share-intent 데이터 처리
  useEffect(() => {
    if (Platform.OS === 'android') return;

    console.log('받은 공유 인텐트:', shareIntent);

    if (
      shareIntent?.text ||
      (shareIntent?.files && shareIntent.files.length > 0)
    ) {
      setCurrentIntent(shareIntent);
      setModalVisible(true);
      setIsShareMode(true);
    }
  }, [shareIntent]);

  const handleClose = () => {
    setModalVisible(false);
    setCurrentIntent(null);
    resetShareIntent();
    // 공유 모드에서 닫으면 앱 종료
    if (isShareMode) {
      BackHandler.exitApp();
    }
  };

  const handleConfirm = () => {
    // TODO: 저장 로직 구현
    console.log('공유 데이터 저장:', currentIntent);
    handleClose();
  };

  // iOS 공유 모드일 때는 BottomSheet만 렌더링
  if (isShareMode) {
    return (
      <View style={{ flex: 1, backgroundColor: 'transparent' }}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ShareIntentModal
          visible={modalVisible}
          shareIntent={currentIntent}
          onClose={handleClose}
          onConfirm={handleConfirm}
          isShareMode={true}
        />
      </View>
    );
  }

  // 일반 모드일 때는 전체 앱 렌더링
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaProvider>
  );
}
