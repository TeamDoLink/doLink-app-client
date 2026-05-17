/**
 * Native App → WebView 메시지 전송 유틸리티
 */

import type WebView from 'react-native-webview';
import { config } from '@/src/utils/envConfig';
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
  KeyboardStateMessage,
} from './types';

/**
 * WebView로 응답 메시지 전송
 */
export const sendToWebView = (
  webViewRef: React.RefObject<WebView | null>,
  response: BridgeResponse,
): void => {
  if (!webViewRef.current) {
    return;
  }

  webViewRef.current.postMessage(JSON.stringify(response));
};

function getRootWebViewUrl(): string {
  const domain = config.domain;
  const normalized = domain.endsWith('/') ? domain.slice(0, -1) : domain;
  return `${normalized}/`;
}

/**
 * WebView를 앱 루트(/)로 이동하고, 이미 루트면 새로고침합니다.
 */
export const navigateWebViewToRootAndReload = (
  webViewRef: React.RefObject<WebView | null>,
): void => {
  const wv = webViewRef.current;
  if (!wv) {
    return;
  }
  const rootUrl = JSON.stringify(getRootWebViewUrl());
  wv.injectJavaScript(
    `(function(){var r=${rootUrl};var p="/";try{p=new URL(window.location.href).pathname||"/";}catch(e){}if(p==="/"||p===""){window.location.reload();}else{window.location.replace(r);}})();true;`,
  );
};

/**
 * WebView를 절대 URL로 이동합니다.
 */
export const navigateWebViewToUrl = (
  webViewRef: React.RefObject<WebView | null>,
  url: string,
): void => {
  const wv = webViewRef.current;
  if (!wv) {
    return;
  }

  const serializedUrl = JSON.stringify(url);
  wv.injectJavaScript(
    `(function(){var url=${serializedUrl};window.setTimeout(function(){window.location.assign(url);}, 0);})();true;`,
  );
};

/**
 * 로그인 성공 시 웹뷰에 auth:login 메시지로 access token 전달
 */
export const sendAuthLoginToWeb = (
  webViewRef: React.RefObject<WebView | null>,
  accessToken?: string | null,
  delayMs = 300,
): void => {
  if (!webViewRef.current) {
    return;
  }
  const message = { type: 'auth:login' as const, payload: { accessToken } };
  setTimeout(() => {
    webViewRef.current?.postMessage(JSON.stringify(message));
  }, delayMs);
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

export const createKeyboardStateMessage = (
  visible: boolean,
  height: number,
  duration?: number,
): KeyboardStateMessage => ({
  type: 'keyboard:state',
  payload: { visible, height, ...(duration !== undefined ? { duration } : {}) },
});
