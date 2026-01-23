/**
 * 외부 앱으로부터 공유받은 데이터 타입 (Android ShareActivity에서 전달)
 */

// TODO thunbnailUrl 필드 사용 여부 검토 필요
export interface ShareIntentData {
  /** 공유된 텍스트 */
  text?: string | null;
  /** 링크 제목 */
  title?: string | null;
  /** 링크 주소 (URL) */
  url?: string | null;
  /** 썸네일 이미지 URL */
  thumbnailUrl?: string | null;
  /** 공유 타입 */
  type?: 'text' | 'media' | 'file' | 'weburl' | null;
}

/**
 * 공유 데이터 저장 결과
 */
export interface ShareIntentSaveResult {
  success: boolean;
  error?: string;
}
