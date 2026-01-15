/**
 * Link Bridge Handler
 * 외부 URL 열기 및 확인 기능 처리
 */

import { Linking } from 'react-native';
import type { LinkMessageType, LinkPayload, LinkResponse } from '../types';
import { createLinkResponseMessage, createLinkErrorResponse } from '../sender';

/**
 * URL 형식 검증
 * http와 https 프로토콜만 허용 (보안)
 */
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    // http와 https만 허용 (javascript:, file: 등 차단)
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

/**
 * URL 열기 처리
 */
const handleOpen = async (payload: LinkPayload): Promise<LinkResponse> => {
  const { url } = payload;

  // 1단계: URL 유효성 검증
  if (!url || typeof url !== 'string') {
    console.log('[Bridge:Link] 잘못된 URL: URL이 비어있거나 문자열이 아닙니다');
    return createLinkErrorResponse(
      '잘못된 URL: URL이 비어있거나 문자열이 아닙니다',
      url,
    );
  }

  const trimmedUrl = url.trim();

  if (!isValidUrl(trimmedUrl)) {
    console.log('[Bridge:Link] 잘못된 URL 형식:', trimmedUrl);
    return createLinkErrorResponse('잘못된 URL 형식', trimmedUrl);
  }

  try {
    // 2단계: URL을 열 수 있는지 확인
    const canOpen = await Linking.canOpenURL(trimmedUrl);

    if (!canOpen) {
      console.warn('[Bridge:Link] URL을 열 수 없음:', trimmedUrl);
      // iOS에서는 canOpenURL이 false를 반환하더라도
      // http/https URL은 대부분 열리므로 시도는 계속 진행
    }

    // 3단계: URL 열기 시도
    console.log('[Bridge:Link] URL 열기:', trimmedUrl);
    await Linking.openURL(trimmedUrl);

    console.log('[Bridge:Link] URL 열기 성공:', trimmedUrl);
    return createLinkResponseMessage(trimmedUrl, true);
  } catch (error) {
    // 4단계: 에러 처리
    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류';
    console.error('[Bridge:Link] URL 열기 실패:', trimmedUrl, errorMessage);

    return createLinkErrorResponse(errorMessage, trimmedUrl);
  }
};

/**
 * URL 열기 가능 여부 확인
 */
const handleCanOpen = async (payload: LinkPayload): Promise<LinkResponse> => {
  const { url } = payload;

  if (!url || typeof url !== 'string') {
    console.error('[Bridge:Link] 잘못된 URL:', url);
    return createLinkErrorResponse('잘못된 URL', url);
  }

  const trimmedUrl = url.trim();

  if (!isValidUrl(trimmedUrl)) {
    console.error('[Bridge:Link] 잘못된 URL 형식:', trimmedUrl);
    return createLinkResponseMessage(trimmedUrl, false, false);
  }

  try {
    const canOpen = await Linking.canOpenURL(trimmedUrl);
    console.log('[Bridge:Link] URL 열기 가능 여부:', trimmedUrl, canOpen);

    return createLinkResponseMessage(trimmedUrl, true, canOpen);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류';
    console.error('[Bridge:Link] URL 확인 실패:', trimmedUrl, errorMessage);

    return createLinkErrorResponse(errorMessage, trimmedUrl);
  }
};

/**
 * Link 메시지 핸들러
 */
export const linkHandler = async (
  messageType: LinkMessageType,
  payload: LinkPayload,
): Promise<LinkResponse> => {
  switch (messageType) {
    case 'link:open':
      return handleOpen(payload);
    case 'link:canOpen':
      return handleCanOpen(payload);
    default:
      console.error('[Bridge:Link] 알 수 없는 메시지 타입:', messageType);
      return createLinkErrorResponse(
        `알 수 없는 Link 메시지 타입입니다: ${messageType}`,
      );
  }
};
