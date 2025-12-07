import { useRef, useState } from 'react';
// import { View, Text, ScrollView } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { config } from '@/src/utils/domainConfig';
import { handleWebViewMessage_draft } from '@/src/utils/webviewBridge';
// import { handleWebViewMessage } from '@/src/utils/webviewBridge';

export default function Index() {
  const webViewRef = useRef<WebView>(null);
  const domain = config.domain;
  // const webUrl = `${domain}`;
  // clipboard test 위한 경로 설정
  const DEFAULT_PATH = '/task/create';
  const webUrl = `${domain}${DEFAULT_PATH}`;

  const handleMessage = async (event: WebViewMessageEvent) => {
    console.log('WebView message 탄다~', event);
    handleWebViewMessage_draft(event, webViewRef);
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
