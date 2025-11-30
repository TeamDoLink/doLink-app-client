import { useRef, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { config } from '@/src/utils/domainConfig';
import { handleWebViewMessage } from '@/src/utils/webviewBridge';

export default function Index() {
  const webViewRef = useRef<WebView>(null);
  const domain = config.domain;
  const webUrl = `${domain}`;

  const handleMessage = async (event: any) => {
    try {
      await handleWebViewMessage(event, webViewRef);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.log(`WebView 메시지 처리 실패: ${errorMsg}`, 'error');
    }
  };

  return (
    <WebView
      ref={webViewRef}
      source={{
        uri: webUrl,
      }}
      onMessage={handleMessage}
      style={{
        flex: 1,
      }}
    />
  );
}
