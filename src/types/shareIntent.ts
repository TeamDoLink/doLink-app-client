/**
 * 외부 앱으로부터 공유받은 데이터 타입
 */
export interface ShareIntentData {
  /** 공유된 URL */
  url?: string;
  /** 공유된 텍스트 */
  text?: string;
  /** 공유된 제목 (있는 경우) */
  title?: string;
  /** 공유 시간 */
  timestamp: number;
}

/**
 * 공유 데이터 저장 결과
 */
export interface ShareIntentSaveResult {
  success: boolean;
  error?: string;
}
