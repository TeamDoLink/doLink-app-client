export type ArchiveCategoryKey =
  | 'all'
  | 'restaurant'
  | 'hobby'
  | 'travel'
  | 'money'
  | 'shopping'
  | 'exercise'
  | 'career'
  | 'study'
  | 'tips'
  | 'etc';

// 모음 데이터에서 사용하는 실제 카테고리 키 (all 제외)
export type ArchiveCategory = Exclude<ArchiveCategoryKey, 'all'>;

export const ARCHIVE_CATEGORY_LABEL: Record<ArchiveCategoryKey, string> = {
  all: '전체',
  restaurant: '맛집',
  hobby: '취미',
  travel: '여행',
  money: '재테크',
  shopping: '쇼핑',
  exercise: '운동',
  career: '커리어',
  study: '자기개발',
  tips: '꿀팁',
  etc: '기타',
} as const;
