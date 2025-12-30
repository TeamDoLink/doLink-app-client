import { useRef } from 'react';
import { StatusBar, Platform } from 'react-native';
import WebView from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { config } from '@/src/utils/envConfig';
import { useWebViewBridge } from '@/src/hooks/useWebViewBridge';

export default function Index() {
  const webViewRef = useRef<WebView>(null);
  const { handleMessage } = useWebViewBridge(webViewRef);

  const domain = config.domain;
  // 할일 추가 페이지 test 위한 path
  const DEFAULT_PATH = '/task/create';
  const webUrl = `${domain}${DEFAULT_PATH}`;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      edges={Platform.OS === 'ios' ? ['top'] : ['top', 'bottom']}
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
