type ClipboardMessageType =
  | 'clipboard:read'
  | 'clipboard:data'
  | 'clipboard:error';

export interface WebViewMessage {
  type: WebViewMessageType;
  payload?: string;
  error?: string;
}

export interface ClipboardReadRequest {
  type: 'clipboard:read';
}

export interface ClipboardDataResponse {
  type: 'clipboard:data';
  payload: string;
}

export interface ClipboardErrorResponse {
  type: 'clipboard:error';
  error: string;
}

export type ClipboardMessage =
  | ClipboardReadRequest
  | ClipboardDataResponse
  | ClipboardErrorResponse;

export type WebViewMessageType = ClipboardMessageType;
