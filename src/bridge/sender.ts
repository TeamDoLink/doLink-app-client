/**
 * Native App → WebView 메시지 전송 유틸리티
 */

import type WebView from 'react-native-webview';
import type {
  BridgeResponse,
  DraftMessageType,
  DraftResponse,
  ClipboardDataMessage,
  ClipboardErrorMessage,
  BridgeErrorMessage,
} from './types';

/**
 * WebView로 응답 메시지 전송
 */
export const sendToWebView = (
  webViewRef: React.RefObject<WebView | null>,
  response: BridgeResponse,
): void => {
  if (!webViewRef.current) {
    console.warn('[Bridge] WebView ref is not available');
    return;
  }

  webViewRef.current.postMessage(JSON.stringify(response));
};

/**
 * Draft 성공 응답 생성 헬퍼
 */
export const createDraftSuccessResponse = <T = any>(
  type: DraftMessageType,
  data?: T,
): DraftResponse<T> => ({
  type,
  success: true,
  data,
});

/**
 * Draft 실패 응답 생성 헬퍼
 */
export const createDraftErrorResponse = (
  type: DraftMessageType,
  error: string,
): DraftResponse => ({
  type,
  success: false,
  error,
});

/**
 * Clipboard 성공 응답 생성 헬퍼
 */
export const createClipboardDataResponse = (
  payload: string,
): ClipboardDataMessage => ({
  type: 'clipboard:data',
  payload,
});

/**
 * Clipboard 에러 응답 생성 헬퍼
 */
export const createClipboardErrorResponse = (
  error: string,
): ClipboardErrorMessage => ({
  type: 'clipboard:error',
  error,
});

/**
 * Bridge 범용 에러 응답 생성 헬퍼
 */
export const createBridgeErrorResponse = (
  error: string,
  originalType?: string,
): BridgeErrorMessage => ({
  type: 'bridge:error',
  error,
  originalType,
});
