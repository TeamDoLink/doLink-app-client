import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import WebView, { WebViewProps } from 'react-native-webview';
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import useWebViewBackHandler from '../hooks/useWebViewBackHandler';
import useLoginHandler from '../hooks/useLoginHandler';
import { useWebViewBridge } from '../hooks/useWebViewBridge';

interface DoLinkWebViewProps extends WebViewProps {}

export default function DoLinkWebView({
  style,
  onNavigationStateChange: onNavChange,
  ...props
}: DoLinkWebViewProps) {
  const webViewRef = useRef<WebView>(null);
  const { handleMessage } = useWebViewBridge(webViewRef);
  const { navStateHandler } = useWebViewBackHandler(webViewRef);
  const { onLoginNavigation } = useLoginHandler(webViewRef);

  const handleNavigationStateChange = (event: WebViewNavigation) => {
    navStateHandler(event);
    onNavChange?.(event);
    onLoginNavigation(event);
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
