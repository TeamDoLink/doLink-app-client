import { useRef, useState } from 'react';
// import { View, Text, ScrollView } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { config } from '@/src/utils/domainConfig';
// import { handleWebViewMessage } from '@/src/utils/webviewBridge';

export default function Index() {
  const webViewRef = useRef<WebView>(null);
  const webUrl = `${domain}`;
  const handleMessage = async (event: WebViewMessageEvent) => {};

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
