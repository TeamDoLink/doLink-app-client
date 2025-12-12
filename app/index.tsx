import { useRef } from 'react';
import WebView from 'react-native-webview';
import { config } from '@/src/utils/domainConfig';
import { useWebViewMessage } from '@/src/hooks/useWebViewMessage';

export default function Index() {
  const webViewRef = useRef<WebView>(null);
  const { handleMessage } = useWebViewMessage();

  const domain = config.domain;
  const webUrl = `${domain}/test3`;

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
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onShouldStartLoadWithRequest={(request) => {
        // 같은 도메인 내 네비게이션만 허용
        if (domain && request.url.startsWith(domain)) {
          return true;
        }
        // 외부 링크는 WebView 내 로딩 차단 - 메시지로만 처리
        return false;
      }}
    />
  );
}
