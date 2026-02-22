import { useRef } from 'react';
import { StatusBar, Platform, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { config } from '@/src/utils/envConfig';
import { useWebViewBridge } from '@/src/hooks/useWebViewBridge';
import useWebViewBackHandler from '@/src/hooks/useWebViewBackHandler';

/**
 * Catch-all 라우트
 * 딥링크로 들어온 모든 미매칭 경로를 WebView로 처리
 * 예: dolink://task/detail/101 → /task/detail/101
 */
export default function UnmatchedRoute() {
  const webViewRef = useRef<WebView>(null);
  const { handleMessage } = useWebViewBridge(webViewRef);
  const { navStateHandler } = useWebViewBackHandler(webViewRef);

  const { unmatched } = useLocalSearchParams<{ unmatched: string[] }>();

  const domain = config.domain;

  // 경로 세그먼트를 웹 경로로 변환
  // unmatched: ['task', 'detail', '101'] → '/task/detail/101'
  const webPath = unmatched ? `/${unmatched.join('/')}` : '/';
  const webUrl = `${domain}${webPath}`;

  return (
    <SafeAreaView
      style={styles.container}
      edges={Platform.OS === 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <WebView
        ref={webViewRef}
        source={{ uri: webUrl }}
        onMessage={handleMessage}
        onNavigationStateChange={navStateHandler}
        style={styles.webview}
      />
    </SafeAreaView>
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
