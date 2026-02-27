/**
 * WebView ↔ Native App 통신을 위한 Bridge 타입 정의
 * Web Client 타입 구조와 호환
 */

// TODO 명명 규칙 불일치 (SAVE_DRAFT vs clipboard:read)
// Draft 메시지 타입
export type DraftMessageType = 'SAVE_DRAFT' | 'LOAD_DRAFT' | 'DELETE_DRAFT';

// Clipboard 메시지 타입 (
export type ClipboardMessageType =
  | 'clipboard:read' // WebView → Native 요청
  | 'clipboard:data' // Native → WebView 성공 응답
  | 'clipboard:error'; // Native → WebView 에러 응답

// Auth 메시지 타입
export type AuthMessageType = 'auth:login' | 'auth:logout';

// Link 메시지 타입
export type LinkMessageType =
  | 'link:open' // WebView → Native 요청 (URL 열기)
  | 'link:canOpen' // WebView → Native 요청 (URL 열기 가능 여부 확인)
  | 'link:response' // Native → WebView 성공 응답
  | 'link:error'; // Native → WebView 에러 응답

// Share 메시지 타입
export type ShareMessageType =
  | 'share:open' // WebView → Native 요청 (공유 시트 열기)
  | 'share:response' // Native → WebView 성공 응답
  | 'share:error'; // Native → WebView 에러 응답

// ShareIntent 메시지 타입 (Native → WebView, 공유 인텐트 데이터 전달)
export type ShareIntentMessageType = 'shareIntent:data';

// 모든 메시지 타입
export type BridgeMessageType =
  | DraftMessageType
  | ClipboardMessageType
  | LinkMessageType
  | ShareMessageType
  | AuthMessageType;

// WebView → Native App 메시지
export interface BridgeMessage<T = any> {
  type: BridgeMessageType;
  payload?: T;
  requestId?: string; // 응답 매칭용 ID (선택)
}

// Draft 응답
export interface DraftResponse<T = any> {
  type: DraftMessageType;
  success: boolean;
  data?: T;
  error?: string;
}

// Clipboard 성공 응답
export interface ClipboardDataMessage {
  type: 'clipboard:data';
  payload: string | null; // 빈 클립보드는 null
}

// Clipboard 에러 응답
export interface ClipboardErrorMessage {
  type: 'clipboard:error';
  error: string;
}

// Clipboard 응답 타입
export type ClipboardResponse = ClipboardDataMessage | ClipboardErrorMessage;

// Link 성공 응답
export interface LinkResponseMessage {
  type: 'link:response';
  success: boolean;
  url: string;
  canOpen?: boolean; // canOpen 요청 시에만 사용
}

// Link 에러 응답
export interface LinkErrorMessage {
  type: 'link:error';
  error: string;
  url?: string;
}

// Link 응답 타입
export type LinkResponse = LinkResponseMessage | LinkErrorMessage;

// Share 성공 응답
export interface ShareResponseMessage {
  type: 'share:response';
  success: boolean;
  activityType?: string; // iOS에서 사용자가 선택한 공유 대상
}

// Share 에러 응답
export interface ShareErrorMessage {
  type: 'share:error';
  error: string;
}

// Share 응답 타입
export type ShareResponse = ShareResponseMessage | ShareErrorMessage;

// ShareIntent 데이터 메시지 (Native → WebView)
export interface ShareIntentDataMessage {
  type: 'shareIntent:data';
  payload: {
    text?: string | null;
    title?: string | null;
    url?: string | null;
    thumbnailUrl?: string | null;
    contentType?: 'text' | 'media' | 'file' | 'weburl' | null;
  };
}

// Auth 상태 메시지 (Web → Native)
export interface AuthStatusMessage {
  type: 'auth:status';
  payload: {
    isAuthenticated: boolean;
  };
}

// Bridge 범용 에러 응답 (알 수 없는 메시지 타입 등)
export interface BridgeErrorMessage {
  type: 'bridge:error';
  error: string;
  originalType?: string; // 원본 메시지 타입 (디버깅용)
}

// 통합 응답 타입
export type BridgeResponse<T = any> =
  | DraftResponse<T>
  | ClipboardResponse
  | LinkResponse
  | ShareResponse
  | AuthResponse
  | BridgeErrorMessage;

// Handler 함수 타입
export type BridgeHandler<TPayload = any, TResult = any> = (
  payload: TPayload,
) => Promise<BridgeResponse>;

// Draft Payload 타입
export interface DraftPayload {
  key: string;
  data?: any;
}

// Link Payload 타입
export interface LinkPayload {
  url: string;
}

// Share Payload 타입
export interface SharePayload {
  url: string;
  title?: string;
  message?: string;
}

// Auth Payload 타입
export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
}

// Auth Response 타입
export interface AuthResponse {
  type: AuthMessageType;
  success: boolean;
}
