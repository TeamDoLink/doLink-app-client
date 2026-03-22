import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import WebView, { WebViewProps } from 'react-native-webview';
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import useWebViewBackHandler from '../hooks/useWebViewBackHandler';
import useLoginHandler from '../hooks/useLoginHandler';
import { useWebViewBridge } from '../hooks/useWebViewBridge';
import { useKeyboardWebViewBridge } from '../hooks/useKeyboardWebViewBridge';
import { createDeeplinkMessage } from '../bridge';
import { useLocalSearchParams } from 'expo-router';

interface DoLinkWebViewProps extends WebViewProps {
  /**
   * WebView는 항상 '/'로 먼저 로드되고,
   * 실제 내부 이동은 postMessage로 위임됩니다.
   */
  pendingNavigatePath?: string | null;
  /**
   * navigate:deeplink 메시지를 전송한 뒤 호출됩니다.
   * (예: pendingNavigatePath 초기화)
   */
  onNavigateSent?: () => void;
}

export default function DoLinkWebView({
  style,
  pendingNavigatePath,
  onNavigateSent,
  onLoadEnd,
  onNavigationStateChange,
  onNavigationStateChange: onNavChange,
  ...props
}: DoLinkWebViewProps) {
  const { initialPath } = useLocalSearchParams<{ initialPath?: string }>();
  const isInitialPathLoaded = useRef(false);
  const webViewRef = useRef<WebView<WebViewProps>>(null);
  const { handleMessage } = useWebViewBridge(webViewRef);
  const { navStateHandler } = useWebViewBackHandler(webViewRef);
  const { onLoginNavigation } = useLoginHandler(webViewRef);

  const handleNavigationStateChange = (event: WebViewNavigation) => {
    navStateHandler(event);
    onNavigationStateChange?.(event);
    onNavChange?.(event);
    onLoginNavigation(event);
  };

  const trySendNavigate = () => {
    if (!initialPath) return;
    if (isInitialPathLoaded.current) return;
    isInitialPathLoaded.current = true;

    webViewRef.current?.postMessage(
      JSON.stringify(createDeeplinkMessage(initialPath)),
    );
    onNavigateSent?.();
  };

  useKeyboardWebViewBridge(webViewRef);

  return (
    <WebView
      ref={webViewRef}
      onMessage={handleMessage}
      onNavigationStateChange={handleNavigationStateChange}
      onLoadEnd={(e) => {
        trySendNavigate();
        onLoadEnd?.(e);
      }}
      style={[styles.webview, style]}
      sharedCookiesEnabled
      javaScriptEnabled
      domStorageEnabled
      originWhitelist={[
        'http://localhost:3000',
        'http://10.0.2.2:3000',
        'http://localhost:8080',
        'http://10.0.2.2:8080',
        'https://app.dolink.team',
        'https://api.dolink.team',
        'https://kauth.kakao.com',
        'https://accounts.kakao.com',
        'http://img1.kakaocdn.net',
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
