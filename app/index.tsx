import { useRef } from 'react';
import {
  StatusBar,
  Platform,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import WebView from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { config } from '@/src/utils/envConfig';
import { useWebViewBridge } from '@/src/hooks/useWebViewBridge';

export default function Index() {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const { handleMessage } = useWebViewBridge(webViewRef);

  const domain = config.domain;
  const DEFAULT_PATH = '/';
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

      {/* ✅ 개발 모드(__DEV__)일 때만 테스트 버튼 렌더링 */}
      {__DEV__ && (
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => router.push('/test')}
          activeOpacity={0.8}
        >
          <Text style={styles.testButtonText}>🧪</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  testButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  testButtonText: {
    fontSize: 28,
  },
});
