/**
 * WebView와 외부 브라우저 연동을 위한 유틸리티
 * 외부 URL을 안전하게 열기 위한 함수들
 */

import { Linking, Platform } from 'react-native';
import type {
  OpenUrlResult,
  LinkButtonClickedPayload,
} from '@/src/types/linkWebview';

/**
 * URL 형식 검증
 * http와 https 프로토콜만 허용 (보안)
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    // http와 https만 허용 (javascript:, file: 등 차단)
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

/**
 * 외부 URL을 기본 브라우저로 열기
 *
 * 처리 순서:
 * 1. URL 유효성 검증
 * 2. URL을 열 수 있는지 확인 (canOpenURL)
 * 3. URL 열기 시도
 * 4. 에러 처리
 *
 * @param url - 열고자 하는 외부 URL
 * @returns 성공 여부와 에러 정보
 */
export async function openExternalUrl(url: string): Promise<OpenUrlResult> {
  // 1단계: URL 유효성 검증
  if (!url || typeof url !== 'string') {
    console.error(
      '[WebViewBridge] 잘못된 URL: URL이 비어있거나 문자열이 아닙니다',
    );
    return {
      success: false,
      error: '잘못된 URL: URL이 비어있거나 문자열이 아닙니다',
      url,
    };
  }

  const trimmedUrl = url.trim();

  if (!isValidUrl(trimmedUrl)) {
    console.error('[WebViewBridge] 잘못된 URL 형식:', trimmedUrl);
    return {
      success: false,
      error: '잘못된 URL 형식',
      url: trimmedUrl,
    };
  }

  try {
    // 2단계: URL을 열 수 있는지 확인
    const canOpen = await Linking.canOpenURL(trimmedUrl);

    if (!canOpen) {
      console.warn('[WebViewBridge] URL을 열 수 없음:', trimmedUrl);
      // iOS에서는 canOpenURL이 false를 반환하더라도
      // http/https URL은 대부분 열리므로 시도는 계속 진행
    }

    // 3단계: URL 열기 시도
    console.log('[WebViewBridge] URL 열기:', trimmedUrl);
    await Linking.openURL(trimmedUrl);

    console.log('[WebViewBridge] URL 열기 성공:', trimmedUrl);
    return {
      success: true,
      url: trimmedUrl,
    };
  } catch (error) {
    // 4단계: 에러 처리
    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류';
    console.error('[WebViewBridge] URL 열기 실패:', trimmedUrl, errorMessage);

    return {
      success: false,
      error: errorMessage,
      url: trimmedUrl,
    };
  }
}

/**
 * 링크 버튼 클릭 이벤트 처리
 * WebView에서 전달받은 링크를 외부 브라우저로 열기
 */
export async function handleLinkButtonClicked(
  payload: LinkButtonClickedPayload,
): Promise<OpenUrlResult> {
  console.log('[WebViewBridge] 링크 버튼 클릭됨:', {
    url: payload.url,
    timestamp: payload.timestamp,
  });

  const result = await openExternalUrl(payload.url);

  if (!result.success) {
    // 실패 시 사용자에게 알릴 수 있도록 로그 기록
    console.error('[WebViewBridge] 링크 열기 실패:', result.error);
  }

  return result;
}

/**
 * URL 열기 가능 여부 확인 (진단용)
 */
export async function getUrlOpenCapability(url: string): Promise<{
  canOpen: boolean;
  isValidFormat: boolean;
  platform: typeof Platform.OS;
}> {
  return {
    canOpen: await Linking.canOpenURL(url).catch(() => false),
    isValidFormat: isValidUrl(url),
    platform: Platform.OS,
  };
}
