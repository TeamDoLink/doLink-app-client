/**
 * Clipboard 관련 네이티브 기능 핸들러
 *
 */

import type { ClipboardResponse } from '../types';
import {
  createClipboardDataResponse,
  createClipboardErrorResponse,
} from '../sender';

/**
 * Clipboard 읽기 핸들러
 */
const handleRead = async (): Promise<ClipboardResponse> => {
  // TODO:  합치기 위해 임시 생성
  // import * as Clipboard from 'expo-clipboard';
  // const text = await Clipboard.getStringAsync();
  // return createClipboardDataResponse(text);

  return createClipboardErrorResponse(
    'Clipboard 기능은 아직 구현되지 않았습니다',
  );
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
