import { ARCHIVE_CATEGORY_EDITOR_KEYS } from './category';
import { CategoryEditorIconImage } from './images';

/**
 * 모음 추가/수정 에디터용 카테고리 목록 (키 순서 + SVG).
 * `images.ts`가 먼저 완전히 로드된 뒤 평가되도록 이 파일에서만 조합합니다.
 */
export const ARCHIVE_CATEGORY_EDITOR_ITEMS = ARCHIVE_CATEGORY_EDITOR_KEYS.map(
  (key) => ({
    key,
    selected: CategoryEditorIconImage[key].selected,
    unselected: CategoryEditorIconImage[key].unselected,
  }),
);
