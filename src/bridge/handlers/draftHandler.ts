/**
 * Draft(임시저장) 관련 네이티브 기능 핸들러
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DraftResponse, DraftPayload, DraftMessageType } from '../types';
import {
  createDraftSuccessResponse,
  createDraftErrorResponse,
} from '../sender';

/**
 * Draft 저장소 Prefix
 * Key 예시: "task-create-draft" (할 일 생성), "task-edit-{id}" (할 일 수정)
 * 화면별 임시저장 분리 및 추후 기능 확장을 위한 네이밍 패턴
 */
const DRAFT_PREFIX = '@dolink_draft_';

/**
 * Draft 저장
 * @param payload.key - 저장할 Draft의 고유 식별자 (예: "task-create-draft")
 * @param payload.data - 저장할 데이터 (any 타입)
 * @returns 성공 시 저장된 데이터 반환, 실패 시 에러 메시지 반환
 */
const handleSave = async (payload: DraftPayload): Promise<DraftResponse> => {
  const { key, data } = payload;

  if (!key) {
    return createDraftErrorResponse('SAVE_DRAFT', 'key가 필요합니다');
  }

  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(`${DRAFT_PREFIX}${key}`, jsonValue);
    return createDraftSuccessResponse('SAVE_DRAFT', { key, data });
  } catch (error) {
    return createDraftErrorResponse(
      'SAVE_DRAFT',
      error instanceof Error ? error.message : '저장 중 오류가 발생했습니다',
    );
  }
};

/**
 * Draft 불러오기
 * @param payload.key - 불러올 Draft의 고유 식별자
 * @returns 성공 시 저장된 데이터 반환 (없으면 null), 실패 시 에러 메시지 반환
 */
const handleLoad = async (payload: DraftPayload): Promise<DraftResponse> => {
  const { key } = payload;

  if (!key) {
    return createDraftErrorResponse('LOAD_DRAFT', 'key가 필요합니다');
  }

  try {
    const jsonValue = await AsyncStorage.getItem(`${DRAFT_PREFIX}${key}`);
    if (jsonValue !== null) {
      const loadedData = JSON.parse(jsonValue);
      return createDraftSuccessResponse('LOAD_DRAFT', loadedData);
    }

    // 데이터가 없는 것은 정상 상황 (처음 사용, 삭제 후 등)
    return createDraftSuccessResponse('LOAD_DRAFT', null);
  } catch (error) {
    return createDraftErrorResponse(
      'LOAD_DRAFT',
      error instanceof Error
        ? error.message
        : '불러오기 중 오류가 발생했습니다',
    );
  }
};

/**
 * Draft 삭제
 * @param payload.key - 삭제할 Draft의 고유 식별자
 * @returns 성공 시 { key, deleted } 반환 (deleted: 실제 삭제 여부), 실패 시 에러 메시지 반환
 */
const handleDelete = async (payload: DraftPayload): Promise<DraftResponse> => {
  const { key } = payload;

  if (!key) {
    return createDraftErrorResponse('DELETE_DRAFT', 'key가 필요합니다');
  }

  try {
    // 삭제 전 존재 여부 확인
    const existed = await AsyncStorage.getItem(`${DRAFT_PREFIX}${key}`);
    await AsyncStorage.removeItem(`${DRAFT_PREFIX}${key}`);

    return createDraftSuccessResponse('DELETE_DRAFT', {
      key,
      deleted: existed !== null,
    });
  } catch (error) {
    return createDraftErrorResponse(
      'DELETE_DRAFT',
      error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다',
    );
  }
};

/**
 * Draft Handler 메인 함수
 */
export const draftHandler = async (
  messageType: DraftMessageType,
  payload: DraftPayload,
): Promise<DraftResponse> => {
  switch (messageType) {
    case 'SAVE_DRAFT':
      return handleSave(payload);
    case 'LOAD_DRAFT':
      return handleLoad(payload);
    case 'DELETE_DRAFT':
      return handleDelete(payload);
  }
};
