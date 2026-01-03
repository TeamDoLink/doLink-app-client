/**
 * WebView 메시지 타입 정의
 * 웹과 네이티브 간 통신을 위한 타입 시스템
 */

/**
 * 기본 메시지 구조
 */
export interface WebViewMessage<T = unknown> {
  type: string;
  payload: T;
}

/**
 * 링크 버튼 클릭 메시지 페이로드
 */
export interface LinkButtonClickedPayload {
  url: string;
  timestamp: string;
}

/**
 * WebView 메시지 타입
 */
export enum WebViewMessageType {
  LINK_BUTTON_CLICKED = 'LINK_BUTTON_CLICKED',
}

/**
 * 타입 안전한 메시지 유니온
 */
export type WebViewMessageData = WebViewMessage<LinkButtonClickedPayload>;

/**
 * URL 열기 결과
 */
export interface OpenUrlResult {
  success: boolean;
  error?: string;
  url?: string;
}
