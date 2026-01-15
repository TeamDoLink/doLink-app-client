/**
 * WebView와 App 간의 통신을 위한 타입 정의
 */

/**
 * WebView에서 보내는 메시지 타입
 */
export type WebViewMessageType = 'SAVE_DRAFT' | 'LOAD_DRAFT' | 'DELETE_DRAFT';

/**
 * WebView에서 App으로 보내는 메시지
 */
export interface WebViewMessage {
  type: WebViewMessageType;
  payload: {
    key: string;
    data?: any;
  };
}

/**
 * App에서 WebView로 보내는 응답
 */
export interface AppResponse<T = any> {
  type: WebViewMessageType;
  success: boolean;
  data?: T;
  error?: string;
}
