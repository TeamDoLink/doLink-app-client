import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import type { WebViewProps } from 'react-native-webview';
import { createNavigationBackMessage } from '../bridge';

const useWebViewBackHandler = (
  webViewRef: React.RefObject<WebView<WebViewProps> | null>,
) => {
  const navStateHandler = (event: WebViewNavigation) => {
    // back 동작은 웹에서 처리하므로, 여기서는 상태만 필요하면 추가로 추적할 수 있습니다.
    // (현재는 유지 목적의 no-op)
    void event;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // WebView가 준비되어 있으면 웹에 back 처리를 위임하고 기본 종료 동작을 막는다.
        if (webViewRef.current) {
          webViewRef.current.postMessage(
            JSON.stringify(createNavigationBackMessage()),
          );
          return true;
        }

        // WebView가 없으면 시스템 기본 동작(예: 앱 종료)에 맡긴다.
        return false;
      },
    );

    return () => {
      backHandler.remove();
    };
  }, [webViewRef]);

  return {
    navStateHandler,
  };
};

export default useWebViewBackHandler;
