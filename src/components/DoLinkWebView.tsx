import React, { useRef, useState } from 'react';
import { View, BackHandler, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { BaseBottomSheet } from './common/bottomSheet/baseBottomSheet';
import type { ShareIntentData } from '../types/shareIntent';
import type { ShareIntentDataMessage } from '../bridge/types';

interface DoLinkWebViewProps {
  shareIntent?: ShareIntentData | null;
}

export default function DoLinkWebView({ shareIntent }: DoLinkWebViewProps) {
  const [visible, setVisible] = useState(true);
  const webViewRef = useRef<WebView>(null);

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
              {/* TODO dolinkWebView로 교체 예정 */}
              <WebView
                ref={webViewRef}
                source={{ uri: 'https://www.naver.com' }}
                onLoadEnd={handleWebViewLoad}
              />
            </View>
          </BaseBottomSheet>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
