import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import type { WebViewProps } from 'react-native-webview';

const useWebViewBackHandler = (
  webViewRef: React.RefObject<WebView<WebViewProps> | null>,
) => {
  const canGoBack = useRef(false);

  const navStateHandler = (event: WebViewNavigation) => {
    canGoBack.current = event.canGoBack;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        console.log('backHandler', canGoBack.current);
        if (canGoBack.current) {
          webViewRef.current?.goBack();
          return true;
        }
      },
    );

    return () => {
      backHandler.remove();
    };
  }, [canGoBack]);

  return {
    navStateHandler,
  };
};

export default useWebViewBackHandler;
