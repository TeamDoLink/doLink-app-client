import { useRef, useState, useEffect } from 'react';
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
import * as Linking from 'expo-linking';
import { config } from '@/src/utils/envConfig';
import { useWebViewBridge } from '@/src/hooks/useWebViewBridge';
import useWebViewBackHandler from '@/src/hooks/useWebViewBackHandler';
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

  const domain = config.domain;
  // const DEFAULT_PATH = '/archives/detail/1';
  const DEFAULT_PATH = '/';

  // 딥링크로 인한 웹 경로 상태 관리
  const [webPath, setWebPath] = useState<string>(DEFAULT_PATH);

  // 딥링크 수신 처리 (핫 스타트 - 앱이 백그라운드에서 포그라운드로)
  const url = Linking.useURL();
  useEffect(() => {
    const deepLinkPath = parseDeepLinkPath(url);
    if (deepLinkPath) {
      setWebPath(deepLinkPath);
    }
  }, [url]);

  // 콜드 스타트 처리 (앱이 완전히 종료된 상태에서 딥링크로 실행)
  useEffect(() => {
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      const deepLinkPath = parseDeepLinkPath(initialUrl);
      if (deepLinkPath) {
        setWebPath(deepLinkPath);
      }
    };
    handleInitialURL();
  }, []);

  const webUrl = `${domain}${webPath}`;

  useEffect(() => {
    console.log('🌐 WebView Loading URL:', webUrl);
    console.log('📱 Platform:', Platform.OS);
    console.log('🏠 Domain:', domain);
  }, [webUrl]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      edges={Platform.OS === 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <DoLinkWebView source={{ uri: webUrl }} />
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
