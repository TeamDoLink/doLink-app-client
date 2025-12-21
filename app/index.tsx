import { useRef, useState } from 'react';
import { StatusBar } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { config } from '@/src/utils/envConfig';
// import { handleWebViewMessage } from '@/src/utils/webviewBridge';

export default function Index() {
  const webViewRef = useRef<WebView>(null);
  const domain = config.domain;
  const webUrl = `${domain}`;
  const handleMessage = async (event: WebViewMessageEvent) => {};

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      edges={['top']}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
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
    </SafeAreaView>
  );
}
