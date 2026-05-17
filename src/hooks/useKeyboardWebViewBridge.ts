import { useEffect } from 'react';
import type WebView from 'react-native-webview';
import { KeyboardEvents } from 'react-native-keyboard-controller';
import { createKeyboardStateMessage, sendToWebView } from '@/src/bridge/sender';
import { useDebounce } from './useDebounce';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * react-native-keyboard-controller 키보드 표시/숨김을 WebView로 전달합니다.
 */
export const useKeyboardWebViewBridge = (
  webViewRef: React.RefObject<WebView | null>,
): void => {
  // 동시에 keyboardWillShow, keyboardWillHide 이벤트가 발생하는 사례가 있음
  // 따라서 20ms 디바운스를 적용해 동시 이벤트 발생 시 마지막 이벤트만 처리하도록 함
  const sendToWebViewDebounced = useDebounce(sendToWebView, 50);

  // safe-area-inset-bottom 값을 뺴고 보내야합니다.
  // 이미 웹뷰는 bottom값을 처리하고있습니다.
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    const showSub = KeyboardEvents.addListener('keyboardWillShow', (e) => {
      sendToWebViewDebounced(
        webViewRef,
        createKeyboardStateMessage(true, e.height - bottom, e.duration),
      );
    });
    const hideSub = KeyboardEvents.addListener('keyboardWillHide', (e) => {
      sendToWebViewDebounced(
        webViewRef,
        createKeyboardStateMessage(false, 0, e.duration),
      );
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [webViewRef]);
};
