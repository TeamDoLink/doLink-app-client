import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import WebView, { WebViewProps } from 'react-native-webview';
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import useWebViewBackHandler from '../hooks/useWebViewBackHandler';
import useLoginHandler from '../hooks/useLoginHandler';
import { useWebViewBridge } from '../hooks/useWebViewBridge';
import { createDeeplinkMessage } from '../bridge';

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

/**
 * 네비게이션 경로를 정규화합니다.
 * @param input 네비게이션 경로
 * @returns 정규화된 네비게이션 경로
 * @example
 * normalizeNavigatePath('') => null
 * normalizeNavigatePath('   ') => null
 * normalizeNavigatePath('home') => '/home'
 * normalizeNavigatePath('/home') => '/home'
 * normalizeNavigatePath('https://www.google.com') => '/'
 * normalizeNavigatePath('https://www.google.com/search?q=test')
 *   => '/search?q=test'
 * normalizeNavigatePath('https://www.google.com/search?q=test#hash')
 *   => '/search?q=test#hash'
 */
function normalizeNavigatePath(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Full URL이 들어올 가능성까지 방어
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const out = `${url.pathname}${url.search}${url.hash}`;
      return out.startsWith('/') ? out : `/${out}`;
    } catch {
      // fallthrough
    }
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
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
  const webViewRef = useRef<WebView>(null);
  const { handleMessage } = useWebViewBridge(webViewRef);
  const { navStateHandler } = useWebViewBackHandler(webViewRef);
  const { onLoginNavigation } = useLoginHandler(webViewRef);

  const isLoadedRef = useRef(false);
  const lastSentPathRef = useRef<string | null>(null);

  const normalizedPendingPath = useMemo(() => {
    if (!pendingNavigatePath) return null;
    const normalized = normalizeNavigatePath(pendingNavigatePath);
    if (!normalized || normalized === '/') return null;
    return normalized;
  }, [pendingNavigatePath]);

  const handleNavigationStateChange = (event: WebViewNavigation) => {
    navStateHandler(event);
    onNavigationStateChange?.(event);
    onNavChange?.(event);
    onLoginNavigation(event);
  };

  const trySendNavigate = (path: string | null) => {
    if (!path) return;
    if (!webViewRef.current) return;
    if (!isLoadedRef.current) return;
    if (lastSentPathRef.current === path) return;

    webViewRef.current.postMessage(JSON.stringify(createDeeplinkMessage(path)));
    lastSentPathRef.current = path;
    onNavigateSent?.();
  };

  useEffect(() => {
    // 이미 로드된 상태에서 pending이 새로 생기는 케이스(핫 스타트 딥링크 등)
    trySendNavigate(normalizedPendingPath);
  }, [normalizedPendingPath]);

  return (
    <WebView
      ref={webViewRef}
      onMessage={handleMessage}
      onNavigationStateChange={handleNavigationStateChange}
      onLoadEnd={(e) => {
        isLoadedRef.current = true;
        trySendNavigate(normalizedPendingPath);
        onLoadEnd?.(e);
      }}
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
