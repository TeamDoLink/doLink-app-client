import { useState, useEffect, useMemo } from 'react';
import { StatusBar, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import { config } from '@/src/utils/envConfig';
import DebugButton from '@/src/components/DebugButton';
import DoLinkWebView from '@/src/components/DoLinkWebView';
import { useGetUser } from '@/src/api/generated/endpoints/user/user';

/**
 * 딥링크 URL에서 웹 경로 추출
 * @param url 딥링크 URL (예: dolink://task/detail/123)
 * @returns 웹 경로 (예: /task/detail/123) 또는 null
 */
const parseDeepLinkPath = (url: string | null): string | null => {
  if (!url) return null;

  const { path } = Linking.parse(url);
  if (path?.startsWith('task/detail/')) {
    return `/${path}`;
  }
  return null;
};

export default function Index() {
  const { data: user, error } = useGetUser();

  console.log('user', user);
  console.log('error', error);
  const { initialPath } = useLocalSearchParams<{ initialPath?: string }>();

  const domain = config.domain;

  // WebView는 항상 루트('/')로 먼저 로드하고, 실제 이동은 postMessage(NAVIGATE)로 위임
  const [pendingNavigatePath, setPendingNavigatePath] = useState<string | null>(
    null,
  );

  // 딥링크 수신 처리 (핫 스타트 - 앱이 백그라운드에서 포그라운드로)
  const url = Linking.useURL();
  useEffect(() => {
    const deepLinkPath = parseDeepLinkPath(url);
    if (deepLinkPath) {
      setPendingNavigatePath(deepLinkPath);
    }
  }, [url]);

  // 콜드 스타트 처리 (앱이 완전히 종료된 상태에서 딥링크로 실행)
  useEffect(() => {
    console.log('deepLinking:', url);
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      const deepLinkPath = parseDeepLinkPath(initialUrl);
      if (deepLinkPath) {
        setPendingNavigatePath(deepLinkPath);
      }
    };
    handleInitialURL();
  }, []);

  const rootWebUrl = useMemo(() => {
    const normalizedDomain = domain.endsWith('/')
      ? domain.slice(0, -1)
      : domain;
    return `${normalizedDomain}/`;
  }, [domain]);

  useEffect(() => {
    console.log('🌐 WebView Loading URL:', rootWebUrl);
    console.log('📱 Platform:', Platform.OS);
    console.log('🏠 Domain:', domain);
    console.log('🧭 Pending navigate path:', pendingNavigatePath);
  }, [rootWebUrl, domain, pendingNavigatePath]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      edges={Platform.OS === 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <DoLinkWebView
        source={{ uri: domain }}
        pendingNavigatePath={pendingNavigatePath}
        onNavigateSent={() => setPendingNavigatePath(null)}
      />
      <DebugButton />
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
