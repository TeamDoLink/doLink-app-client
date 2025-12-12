/**
 * WebView 메시지 처리를 위한 커스텀 훅
 * 메시지 타입에 따라 적절한 핸들러 실행
 */

import { useCallback } from 'react';
import type { WebViewMessageEvent } from 'react-native-webview';
import { handleLinkButtonClicked } from '@/src/utils/webviewBridge';
import type {
  WebViewMessageData,
  LinkButtonClickedPayload,
} from '@/src/types/webview';

/**
 * WebView 메시지 핸들러를 제공하는 커스텀 훅
 * 웹뷰에서 전달되는 메시지 타입에 따라 적절한 처리 수행
 *
 * @returns handleMessage - WebView onMessage에 전달할 핸들러 함수
 */
export function useWebViewMessage() {
  const handleMessage = useCallback(async (event: WebViewMessageEvent) => {
    try {
      // 메시지 데이터 파싱
      const messageData: WebViewMessageData = JSON.parse(
        event.nativeEvent.data,
      );

      console.log('[useWebViewMessage] 메시지 수신:', messageData.type);

      // 메시지 타입에 따라 적절한 핸들러 실행
      switch (messageData.type) {
        case 'LINK_BUTTON_CLICKED': {
          const payload = messageData.payload as LinkButtonClickedPayload;

          await handleLinkButtonClicked(payload);
          break;
        }

        // 추가 메시지 타입은 여기에 정의
        // case 'OTHER_MESSAGE_TYPE': {
        //   const payload = messageData.payload as OtherPayloadType;
        //   await handleOtherMessage(payload);
        //   break;
        // }

        default:
          console.warn(
            '[useWebViewMessage] 알 수 없는 메시지 타입:',
            messageData.type,
          );
      }
    } catch (error) {
      // 잘못된 형식의 메시지 처리 - 브라우저 로그로 기록
      console.error('[useWebViewMessage] 메시지 파싱 오류:', error);
    }
  }, []);

  return {
    handleMessage,
  };
}
