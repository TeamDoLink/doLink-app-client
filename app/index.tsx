import { useRef, useState, useEffect, useMemo } from 'react';
import {
  StatusBar,
  Platform,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import { config } from '@/src/utils/envConfig';
import DebugButton from '@/src/components/DebugButton';
import DoLinkWebView from '@/src/components/DoLinkWebView';
import { useGetUser } from '@/src/api/generated/endpoints/user/user';
// use React Native's built-in KeyboardAvoidingView

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
  const domain = config.domain;

  const rootWebUrl = useMemo(() => {
    const normalizedDomain = domain.endsWith('/')
      ? domain.slice(0, -1)
      : domain;
    return `${normalizedDomain}/`;
  }, [domain]);

  const [currentUrl, setCurrentUrl] = useState(rootWebUrl);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const isTaskForm = /\/task\/(edit|create)/.test(currentUrl);
  const needsKeyboardAvoiding = isTaskForm && keyboardVisible;

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // When navigating away from task edit/create, ensure keyboard is dismissed
  useEffect(() => {
    if (!isTaskForm) {
      Keyboard.dismiss();
    }
  }, [currentUrl, isTaskForm]);

  useEffect(() => {
    console.log('🌐 WebView Loading URL:', rootWebUrl);
    console.log('📱 Platform:', Platform.OS);
    console.log('🏠 Domain:', domain);
  }, [rootWebUrl, domain]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      edges={Platform.OS === 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        enabled={needsKeyboardAvoiding}
      >
        <DoLinkWebView
          source={{ uri: rootWebUrl }}
          onNavigationStateChange={(e) => setCurrentUrl(e.url)}
        />
      </KeyboardAvoidingView>
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
