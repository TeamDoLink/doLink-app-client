/**
 * WebView와 App 간의 통신을 담당하는 브릿지
 *
 * @example WebView 내부에서 사용하는 방법
 * ```javascript
 * // 1. 임시저장하기
 * window.ReactNativeWebView.postMessage(JSON.stringify({
 *   type: 'SAVE_DRAFT',
 *   payload: {
 *     key: 'my-task',
 *     data: { title: '할 일', content: '내용' }
 *   }
 * }));
 *
 * // 2. 임시저장 불러오기
 * window.ReactNativeWebView.postMessage(JSON.stringify({
 *   type: 'LOAD_DRAFT',
 *   payload: {
 *     key: 'my-task'
 *   }
 * }));
 *
 * // 3. 임시저장 삭제하기
 * window.ReactNativeWebView.postMessage(JSON.stringify({
 *   type: 'DELETE_DRAFT',
 *   payload: {
 *     key: 'my-task'
 *   }
 * }));
 *
 * // 4. App에서 응답 받기
 * window.addEventListener('message', (event) => {
 *   const response = JSON.parse(event.data);
 *   if (response.success) {
 *     console.log('성공:', response.data);
 *   } else {
 *     console.error('실패:', response.error);
 *   }
 * });
 * ```
 */

import type { WebView } from 'react-native-webview';
import type { WebViewMessage, AppResponse } from '@/src/types/webview';
import { saveDraft, getDraft, deleteDraft } from './draftStorage';

/**
 * App에서 WebView로 응답을 보냅니다
 */
export const sendToWebView_draft = <T = any>(
  webViewRef: React.RefObject<WebView>,
  response: AppResponse<T>,
) => {
  webViewRef.current?.postMessage(JSON.stringify(response));
};

/**
 * WebView에서 받은 TaskDraft 메시지를 처리합니다
 */
export const handleTaskDraftMessage_draft = async (
  message: WebViewMessage,
  webViewRef: React.RefObject<WebView>,
) => {
  const { type, payload } = message;
  const { key, data } = payload;

  try {
    switch (type) {
      case 'SAVE_DRAFT': {
        const success = await saveDraft(key, data);
        sendToWebView_draft(webViewRef, {
          type,
          success,
          data: success ? { key } : undefined,
          error: success ? undefined : '임시저장에 실패했습니다',
        });
        break;
      }

      case 'LOAD_DRAFT': {
        const loadedData = await getDraft(key);
        sendToWebView_draft(webViewRef, {
          type,
          success: loadedData !== null,
          data: loadedData,
          error: loadedData === null ? '불러올 데이터가 없습니다' : undefined,
        });
        break;
      }

      case 'DELETE_DRAFT': {
        const success = await deleteDraft(key);
        sendToWebView_draft(webViewRef, {
          type,
          success,
          data: success ? { key } : undefined,
          error: success ? undefined : '삭제에 실패했습니다',
        });
        break;
      }

      default:
        sendToWebView_draft(webViewRef, {
          type,
          success: false,
          error: '알 수 없는 메시지 타입입니다',
        });
    }
  } catch (error) {
    sendToWebView_draft(webViewRef, {
      type,
      success: false,
      error:
        error instanceof Error ? error.message : '처리 중 오류가 발생했습니다',
    });
  }
};

/**
 * WebView에서 받은 메시지를 파싱하고 처리합니다
 */
export const handleWebViewMessage_draft = (
  event: { nativeEvent: { data: string } },
  webViewRef: React.RefObject<WebView>,
) => {
  try {
    const message: WebViewMessage = JSON.parse(event.nativeEvent.data);
    handleTaskDraftMessage_draft(message, webViewRef);
  } catch (error) {
    console.error('WebView 메시지 파싱 실패:', error);
  }
};
