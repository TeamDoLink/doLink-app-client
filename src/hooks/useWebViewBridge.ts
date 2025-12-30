/**
 * WebView Bridge를 위한 React Hook
 *
 * @example
 * const webViewRef = useRef<WebView>(null);
 * const { handleMessage } = useWebViewBridge(webViewRef);
 *
 * return <WebView ref={webViewRef} onMessage={handleMessage} />;
 */

import type WebView from 'react-native-webview';
import { handleWebViewMessage } from '@/src/bridge';

interface UseWebViewBridgeReturn {
  /**
   * WebView의 onMessage prop에 전달할 핸들러
   */
  handleMessage: (event: { nativeEvent: { data: string } }) => void;
}

/**
 * WebView Bridge Hook
 */
export const useWebViewBridge = (
  webViewRef: React.RefObject<WebView | null>,
): UseWebViewBridgeReturn => {
  // 메시지 핸들러
  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    handleWebViewMessage(event, webViewRef);
  };

  return {
    handleMessage,
  };
};
