/**
 * WebView 통신 관련 상수
 */
export const WEBVIEW_MESSAGE_TYPES = {
  CLIPBOARD_READ: 'clipboard:read',
  CLIPBOARD_DATA: 'clipboard:data',
  CLIPBOARD_ERROR: 'clipboard:error',
} as const;

export const WEBVIEW_MESSAGES = {
  CLIPBOARD: {
    READ: { type: WEBVIEW_MESSAGE_TYPES.CLIPBOARD_READ },
    ERROR: (error: string) => ({
      type: WEBVIEW_MESSAGE_TYPES.CLIPBOARD_ERROR,
      error,
    }),
  },
} as const;
