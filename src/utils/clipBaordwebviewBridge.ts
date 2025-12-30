import * as Clipboard from 'expo-clipboard';
import {
  ClipboardMessage,
  ClipboardDataResponse,
  ClipboardErrorResponse,
} from '@/src/types/clipboardTypes';
import { WEBVIEW_MESSAGE_TYPES } from '@/src/constants/clipboardConst';

/**
 * WebView 메시지를 파싱합니다
 */
export const parseWebViewMessage = (data: string): ClipboardMessage | null => {
  try {
    const parsed = JSON.parse(data);
    console.log('[WebView Bridge] 🔍 메시지 파싱 성공:', parsed);
    return parsed;
  } catch (error) {
    console.warn('[WebView Bridge] ❌ 메시지 파싱 실패:', error, 'Data:', data);
    return null;
  }
};

/**
 * 메시지가 유효한 Clipboard 메시지인지 확인합니다
 */
export const isClipboardMessage = (data: unknown): data is ClipboardMessage => {
  if (!data || typeof data !== 'object') return false;
  if (!('type' in data)) return false;

  const type = (data as Record<string, unknown>).type;
  const validTypes = Object.values(WEBVIEW_MESSAGE_TYPES) as string[];
  return validTypes.includes(type as string);
};

/**
 * 클립보드에서 텍스트를 읽어 응답 메시지를 생성합니다
 */
export const getClipboardResponse = async (): Promise<
  ClipboardDataResponse | ClipboardErrorResponse
> => {
  try {
    console.log('[WebView Bridge] 🔄 Clipboard.getStringAsync() 호출 중...');
    const text = await Clipboard.getStringAsync();
    console.log(
      '[WebView Bridge] ✅ 클립보드 읽기 성공:',
      text ? `"${text.substring(0, 50)}..."` : '(빈 클립보드)',
    );
    return {
      type: WEBVIEW_MESSAGE_TYPES.CLIPBOARD_DATA,
      payload: text || '',
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[WebView Bridge] ❌ 클립보드 읽기 실패:', errorMsg);
    return {
      type: WEBVIEW_MESSAGE_TYPES.CLIPBOARD_ERROR,
      error: errorMsg || 'Unknown error occurred',
    };
  }
};

/**
 * 메시지를 WebView로 전송합니다
 */
export const sendMessageToWebView = (
  webViewRef: React.RefObject<any>,
  message:
    | ClipboardDataResponse
    | ClipboardErrorResponse
    | Record<string, unknown>,
): void => {
  if (!webViewRef.current) {
    console.warn('[WebView Bridge] ❌ WebView ref를 사용할 수 없습니다');
    return;
  }

  try {
    const jsonString = JSON.stringify(message);
    console.log('[WebView Bridge] 🚀 WebView로 메시지 전송 중:', message);
    webViewRef.current.postMessage(jsonString);
    console.log('[WebView Bridge] ✅ WebView로 메시지 전송 완료');
  } catch (error) {
    console.error('[WebView Bridge] ❌ WebView로 메시지 전송 실패:', error);
  }
};

/**
 * WebView 메시지 핸들러
 */
export const handleWebViewMessage = async (
  event: any,
  webViewRef: React.RefObject<any>,
): Promise<void> => {
  const { data } = event.nativeEvent;
  console.log('[WebView Bridge] 📨 메시지 수신:', data);

  const message = parseWebViewMessage(data);
  if (!isClipboardMessage(message)) {
    console.warn('[WebView Bridge] ❌ 유효하지 않은 메시지 형식:', data);
    return;
  }

  console.log('[WebView Bridge] ✅ 메시지 검증 완료:', message.type);

  if (message.type === WEBVIEW_MESSAGE_TYPES.CLIPBOARD_READ) {
    console.log('[WebView Bridge] 📋 클립보드 읽기 시작...');
    const response = await getClipboardResponse();
    console.log('[WebView Bridge] 📤 응답 전송:', response);
    sendMessageToWebView(webViewRef, response);
  }
};
