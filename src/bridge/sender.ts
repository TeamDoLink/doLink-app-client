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
  LinkResponseMessage,
  LinkErrorMessage,
  BridgeErrorMessage,
  NavigationBackMessage,
  DeeplinkMessage,
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

  console.log('[Bridge] 웹으로 응답 전송:', response);
  webViewRef.current.postMessage(JSON.stringify(response));
};

/**
 * 로그인 성공 시 웹뷰에 auth:login 메시지로 access token 전달
 */
export const sendAuthLoginToWeb = (
  webViewRef: React.RefObject<WebView | null>,
  accessToken?: string | null,
): void => {
  if (!webViewRef.current) {
    console.warn('[Bridge] WebView ref is not available');
    return;
  }
  const message = { type: 'auth:login' as const, payload: { accessToken } };
  if (__DEV__) {
    console.log('[Bridge] 웹으로 응답 전송:', message);
  }
  setTimeout(() => {
    webViewRef.current?.postMessage(JSON.stringify(message));
  }, 300);
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
  payload: string | null,
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
 * Link 성공 응답 생성 헬퍼
 */
export const createLinkResponseMessage = (
  url: string,
  success: boolean,
  canOpen?: boolean,
): LinkResponseMessage => ({
  type: 'link:response',
  success,
  url,
  canOpen,
});

/**
 * Link 에러 응답 생성 헬퍼
 */
export const createLinkErrorResponse = (
  error: string,
  url?: string,
): LinkErrorMessage => ({
  type: 'link:error',
  error,
  url,
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

export const createNavigationBackMessage = (): NavigationBackMessage => ({
  type: 'navigate:back',
});

export const createDeeplinkMessage = (path: string): DeeplinkMessage => ({
  type: 'navigate:deeplink',
  payload: { path },
});
