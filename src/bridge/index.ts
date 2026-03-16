import type WebView from 'react-native-webview';
import { BackHandler, Platform } from 'react-native';
import type {
  BridgeMessage,
  BridgeMessageType,
  DraftMessageType,
  ClipboardMessageType,
  LinkMessageType,
  ShareMessageType,
  OsShareMessageType,
  NavigationMessageType,
  DraftPayload,
  LinkPayload,
  SharePayload,
  OsSharePayload,
  AuthMessageType,
} from './types';
import type { AuthPayload } from './types';
import {
  sendToWebView,
  createBridgeErrorResponse,
  sendAuthLoginToWeb,
} from './sender';
import { draftHandler } from './handlers/draftHandler';
import { clipboardHandler } from './handlers/clipboardHandler';
import { linkHandler } from './handlers/linkHandler';
import { shareHandler, osShareHandler } from './handlers/shareHandler';
import { authHandler } from './handlers/authHandler';
import useAuthStore from '../stores/useAuthStore';

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
 * WebView → Native 요청만 체크 (응답 타입은 제외)
 */
const isClipboardMessage = (
  type: BridgeMessageType,
): type is ClipboardMessageType => {
  return type === 'clipboard:read';
};

/**
 * 메시지 타입이 Link 관련인지 확인 (Type Guard)
 * WebView → Native 요청만 체크 (응답 타입은 제외)
 */
const isLinkMessage = (type: BridgeMessageType): type is LinkMessageType => {
  return type === 'link:open' || type === 'link:canOpen';
};

/**
 * 메시지 타입이 Share 관련인지 확인 (Type Guard)
 * WebView → Native 요청만 체크 (응답 타입은 제외)
 */
const isShareMessage = (type: BridgeMessageType): type is ShareMessageType => {
  return type === 'share:open';
};

const isAuthMessage = (type: BridgeMessageType): type is AuthMessageType => {
  return type === 'auth:login' || type === 'auth:logout';
};

/**
 * 메시지 타입이 OsShare 관련인지 확인 (Type Guard)
 */
const isOsShareMessage = (
  type: BridgeMessageType,
): type is OsShareMessageType => {
  return type === 'os:share';
};

/**
 * 메시지 타입이 Navigation 관련인지 확인 (Type Guard)
 * WebView → Native 요청만 체크
 */
const isNavigationMessage = (
  type: BridgeMessageType,
): type is NavigationMessageType => {
  return type === 'navigate:back:exit';
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

    // Link 메시지 처리
    if (isLinkMessage(type)) {
      const response = await linkHandler(type, payload as LinkPayload);
      sendToWebView(webViewRef, response);
      return;
    }

    // Share 메시지 처리
    if (isShareMessage(type)) {
      const response = await shareHandler(type, payload as SharePayload);
      sendToWebView(webViewRef, response);
      return;
    }

    // OS Share 메시지 처리
    if (isOsShareMessage(type)) {
      const response = await osShareHandler(payload as OsSharePayload);
      sendToWebView(webViewRef, response);
      return;
    }

    // Navigation 메시지 처리
    if (isNavigationMessage(type)) {
      // Android에서만 앱 종료 처리
      if (Platform.OS === 'android') {
        BackHandler.exitApp();
      }
      return;
    }

    // Auth: 로그아웃 시 스토어/Secure Storage 토큰 제거 (웹에 응답 없음)
    if (type === 'auth:logout') {
      await authHandler('auth:logout', (payload ?? {}) as AuthPayload);
      return;
    }

    if (type === 'auth:login') {
      await authHandler('auth:login', {});
      const accessToken = useAuthStore.getState().accessToken;
      sendAuthLoginToWeb(webViewRef, accessToken);
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
    const errorResponse = createBridgeErrorResponse(
      error instanceof Error ? error.message : '처리 중 오류가 발생했습니다',
      type,
    );
    sendToWebView(webViewRef, errorResponse);
  }
};

/**
 * WebView의 onMessage 이벤트 핸들러
 */
export const handleWebViewMessage = async (
  event: { nativeEvent: { data: string } },
  webViewRef: React.RefObject<WebView | null>,
): Promise<void> => {
  try {
    const message: BridgeMessage = JSON.parse(event.nativeEvent.data);

    // 유효성 검사
    if (!message.type) {
      console.error('[Bridge] 메시지에 type이 없습니다:', message);
      return;
    }

    await handleBridgeMessage(message, webViewRef);
  } catch (error) {
    console.error('[Bridge] 메시지 파싱 실패:', error);
  }
};

// Export types and utilities
export * from './types';
export * from './sender';
