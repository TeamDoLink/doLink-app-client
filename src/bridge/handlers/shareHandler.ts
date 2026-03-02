import { Share, Platform } from 'react-native';
import type {
  ShareMessageType,
  SharePayload,
  ShareResponse,
  OsSharePayload,
  OsShareResponse,
} from '../types';

/**
 * OS 공유 시트 핸들러
 * 딥링크 무관, OS 기본 공유 시트를 통해 URL/텍스트 공유
 */
export const osShareHandler = async (
  payload: OsSharePayload,
): Promise<OsShareResponse> => {
  const { url } = payload;

  if (!url || typeof url !== 'string') {
    return { type: 'os:share:error', error: 'URL이 필요합니다' };
  }

  try {
    const result = await Share.share({
      url, // iOS: URL 공유
      message: url, // Android: URL 텍스트
    });

    if (result.action === Share.sharedAction) {
      return {
        type: 'os:share:response',
        success: true,
        activityType: result.activityType ?? undefined,
      };
    }

    return { type: 'os:share:response', success: false };
  } catch (error) {
    console.error('[OsShareHandler] 공유 실패:', error);
    return {
      type: 'os:share:error',
      error:
        error instanceof Error ? error.message : '공유 중 오류가 발생했습니다',
    };
  }
};

/**
 * Share 관련 메시지 처리 핸들러
 * 네이티브 공유 시트를 열어 딥링크 URL을 공유
 */
export const shareHandler = async (
  type: ShareMessageType,
  payload: SharePayload,
): Promise<ShareResponse> => {
  if (type !== 'share:open') {
    return {
      type: 'share:error',
      error: `지원하지 않는 Share 메시지 타입: ${type}`,
    };
  }

  try {
    const { url, title, message } = payload;

    // URL 유효성 검사
    if (!url || typeof url !== 'string') {
      return {
        type: 'share:error',
        error: 'URL이 필요합니다',
      };
    }

    // 플랫폼별 공유 옵션 구성
    const shareContent = Platform.select({
      ios: {
        url,
        message: message || title,
      },
      android: {
        // Android에서는 url을 message에 포함
        message: message ? `${message}\n${url}` : url,
        title,
      },
      default: {
        message: url,
      },
    });

    const result = await Share.share(shareContent);

    if (result.action === Share.sharedAction) {
      return {
        type: 'share:response',
        success: true,
        activityType: result.activityType ?? undefined,
      };
    } else if (result.action === Share.dismissedAction) {
      // 사용자가 공유 시트를 닫음
      return {
        type: 'share:response',
        success: false,
      };
    }

    return {
      type: 'share:response',
      success: false,
    };
  } catch (error) {
    console.error('[ShareHandler] 공유 실패:', error);
    return {
      type: 'share:error',
      error:
        error instanceof Error ? error.message : '공유 중 오류가 발생했습니다',
    };
  }
};
