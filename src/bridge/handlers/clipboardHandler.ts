/**
 * Clipboard 관련 네이티브 기능 핸들러
 */

import * as Clipboard from 'expo-clipboard';
import type { ClipboardResponse } from '../types';
import {
  createClipboardDataResponse,
  createClipboardErrorResponse,
} from '../sender';

/**
 * Clipboard 읽기 핸들러
 * @returns 성공 시 clipboard:data (빈 클립보드는 null), 실패 시 clipboard:error
 */
const handleRead = async (): Promise<ClipboardResponse> => {
  try {
    const text = await Clipboard.getStringAsync();

    // 빈 클립보드는 null로 반환
    return createClipboardDataResponse(text || null);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    // 권한 에러 체크 (iOS/Android 권한 거부)
    if (
      errorMsg.includes('permission') ||
      errorMsg.includes('Permission') ||
      errorMsg.includes('denied') ||
      errorMsg.includes('Denied')
    ) {
      return createClipboardErrorResponse('CLIPBOARD_PERMISSION_FAILED');
    }

    return createClipboardErrorResponse(errorMsg || 'Unknown error occurred');
  }
};

/**
 * Clipboard Handler 메인 함수
 */
export const clipboardHandler = async (
  messageType: string,
): Promise<ClipboardResponse> => {
  switch (messageType) {
    case 'clipboard:read':
      return handleRead();
    default:
      return createClipboardErrorResponse(
        `알 수 없는 Clipboard 메시지 타입입니다: ${messageType}`,
      );
  }
};
