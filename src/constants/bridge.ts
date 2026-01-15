/**
 * Bridge 메시지 타입 상수
 * Web Client 타입 구조와 완전 호환
 */

export const BRIDGE_MESSAGE_TYPES = {
  // Draft (Web Client와 동일)
  SAVE_DRAFT: 'SAVE_DRAFT',
  LOAD_DRAFT: 'LOAD_DRAFT',
  DELETE_DRAFT: 'DELETE_DRAFT',

  // Clipboard (Web Client와 동일)
  CLIPBOARD_READ: 'clipboard:read',
  CLIPBOARD_DATA: 'clipboard:data',
  CLIPBOARD_ERROR: 'clipboard:error',
} as const;
