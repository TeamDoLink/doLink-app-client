import type WebView from 'react-native-webview';
import type {
  BridgeMessage,
  BridgeMessageType,
  DraftMessageType,
  ClipboardMessageType,
  DraftPayload,
} from './types';
import { sendToWebView, createBridgeErrorResponse } from './sender';
import { draftHandler } from './handlers/draftHandler';
import { clipboardHandler } from './handlers/clipboardHandler';

/**
 * 메시지 타입이 Draft 관련인지 확인 (Type Guard)
 */
const isDraftMessage = (type: BridgeMessageType): type is DraftMessageType => {
  return (
    type === 'SAVE_DRAFT' || type === 'LOAD_DRAFT' || type === 'DELETE_DRAFT'
  );
};

/**
 * 메시지 타입이 Clipboard 관련인지 확인 (Type Guard)
 */
const isClipboardMessage = (
  type: BridgeMessageType,
): type is ClipboardMessageType => {
  return (
    type === 'clipboard:read' ||
    type === 'clipboard:data' ||
    type === 'clipboard:error'
  );
};

/**
 * WebView에서 받은 메시지를 처리하고 적절한 Handler로 라우팅
 */
export const handleBridgeMessage = async (
  message: BridgeMessage,
  webViewRef: React.RefObject<WebView | null>,
): Promise<void> => {
  const { type, payload } = message;

  try {
    // Draft 메시지 처리
    if (isDraftMessage(type)) {
      const response = await draftHandler(type, payload as DraftPayload);
      sendToWebView(webViewRef, response);
      return;
    }

    // Clipboard 메시지 처리
    if (isClipboardMessage(type)) {
      const response = await clipboardHandler(type);
      sendToWebView(webViewRef, response);
      return;
    }

    // 알 수 없는 메시지 타입 - 에러 응답 전송
    console.warn(`[Bridge] 지원하지 않는 메시지 타입: ${type}`);
    const errorResponse = createBridgeErrorResponse(
      `지원하지 않는 메시지 타입입니다: ${type}`,
      type,
    );
    sendToWebView(webViewRef, errorResponse);
  } catch (error) {
    console.error(`[Bridge] ${type} 처리 중 오류:`, error);
  }
};

/**
 * WebView의 onMessage 이벤트 핸들러
 */
export const handleWebViewMessage = (
  event: { nativeEvent: { data: string } },
  webViewRef: React.RefObject<WebView | null>,
): void => {
  try {
    const message: BridgeMessage = JSON.parse(event.nativeEvent.data);

    // 유효성 검사
    if (!message.type) {
      console.error('[Bridge] 메시지에 type이 없습니다:', message);
      return;
    }

    handleBridgeMessage(message, webViewRef);
  } catch (error) {
    console.error('[Bridge] 메시지 파싱 실패:', error);
  }
};

// Export types and utilities
export * from './types';
export * from './sender';
