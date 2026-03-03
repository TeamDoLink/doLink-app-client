import { StyleSheet } from 'react-native';
import WebView, { WebViewProps } from 'react-native-webview';
import useWebViewBackHandler from '../hooks/useWebViewBackHandler';
import { useWebViewBridge } from '../hooks/useWebViewBridge';
import { useRef } from 'react';
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';

interface DoLinkWebViewProps extends WebViewProps {}

export default function DoLinkWebView({ style, ...props }: DoLinkWebViewProps) {
  const webViewRef = useRef<WebView>(null);
  const { handleMessage } = useWebViewBridge(webViewRef);
  const { navStateHandler } = useWebViewBackHandler(webViewRef);

  const handleNavigationStateChange = (event: WebViewNavigation) => {
    navStateHandler(event);
  };

  return (
    <WebView
      ref={webViewRef}
      onMessage={handleMessage}
      onNavigationStateChange={handleNavigationStateChange}
      style={[styles.webview, style]}
      sharedCookiesEnabled
      javaScriptEnabled
      domStorageEnabled
      originWhitelist={[
        'http://localhost:8081',
        'http://127.0.0.1:8081',
        'http://10.0.2.2:8081',
        'https://*',
        'http://*',
        'intent://*',
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
});
