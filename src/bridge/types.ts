/**
 * WebView ↔ Native App 통신을 위한 Bridge 타입 정의
 * Web Client 타입 구조와 호환
 */

// Draft 메시지 타입
export type DraftMessageType = 'SAVE_DRAFT' | 'LOAD_DRAFT' | 'DELETE_DRAFT';

// Clipboard 메시지 타입 (
export type ClipboardMessageType =
  | 'clipboard:read' // WebView → Native 요청
  | 'clipboard:data' // Native → WebView 성공 응답
  | 'clipboard:error'; // Native → WebView 에러 응답

// Link 메시지 타입
export type LinkMessageType =
  | 'link:open' // WebView → Native 요청 (URL 열기)
  | 'link:canOpen' // WebView → Native 요청 (URL 열기 가능 여부 확인)
  | 'link:response' // Native → WebView 성공 응답
  | 'link:error'; // Native → WebView 에러 응답

// 모든 메시지 타입
export type BridgeMessageType =
  | DraftMessageType
  | ClipboardMessageType
  | LinkMessageType;

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
