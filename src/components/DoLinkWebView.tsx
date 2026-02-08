import React, { useRef, useState } from 'react';
import { View, BackHandler, StatusBar, Linking } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import * as Clipboard from 'expo-clipboard';
import { BaseBottomSheet } from './common/bottomSheet/baseBottomSheet';
import type { ShareIntentData } from '../types/shareIntent';
import type {
  ShareIntentDataMessage,
  AuthStatusMessage,
} from '../bridge/types';
import { config } from '../utils/envConfig';

interface DoLinkWebViewProps {
  shareIntent?: ShareIntentData | null;
}

export default function DoLinkWebView({ shareIntent }: DoLinkWebViewProps) {
  const domain = config.domain;
  const [visible, setVisible] = useState(true);
  const webViewRef = useRef<WebView>(null);

  const DEFAULT_PATH = '/share-intent';
  const webViewUrl = `${domain}${DEFAULT_PATH}`;

  const handleClose = () => {
    setVisible(false);
    BackHandler.exitApp();
  };

  const handleWebViewLoad = () => {
    if (!shareIntent || !webViewRef.current) return;

    const message: ShareIntentDataMessage = {
      type: 'shareIntent:data',
      payload: {
        text: shareIntent.text,
        title: shareIntent.title,
        url: shareIntent.url,
        thumbnailUrl: shareIntent.thumbnailUrl,
        contentType: shareIntent.type,
      },
    };

    webViewRef.current.postMessage(JSON.stringify(message));
  };

  const handleMessage = async (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'auth:status') {
        const { isAuthenticated } = (data as AuthStatusMessage).payload;

        if (isAuthenticated) {
          // 로그인 되어있다면 공유 데이터 내려줌
          handleWebViewLoad();
        } else {
          // 로그인 되어있지 않다면
          // 1. 공유하려는 URL을 클립보드에 저장
          const sharedUrl = shareIntent?.url || shareIntent?.text || '';
          if (sharedUrl) {
            await Clipboard.setStringAsync(sharedUrl);
          }

          // 2. 딥링크로 메인 액티비티 연다 (/)
          Linking.openURL('dolink://');

          // 3. 현재 공유 액티비티 종료
          handleClose();
        }
      }
    } catch (error) {
      console.error('[DoLinkWebView] 메시지 처리 에러:', error);
    }
  };

  if (!visible) return null;

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-transparent">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />

        {/* 오버레이 */}
        <View
          className="absolute inset-0 bg-black/50"
          onTouchEnd={handleClose}
        />

        {/* BottomSheet */}
        <View className="absolute bottom-0 left-0 right-0 bg-transparent">
          <BaseBottomSheet onClose={handleClose} expandable>
            <View className="flex-1 overflow-hidden rounded-xl">
              <WebView
                ref={webViewRef}
                source={{ uri: webViewUrl }}
                onMessage={handleMessage}
              />
            </View>
          </BaseBottomSheet>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
