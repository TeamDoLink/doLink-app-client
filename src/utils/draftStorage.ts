import AsyncStorage from '@react-native-async-storage/async-storage';

const DRAFT_PREFIX = '@dolink_draft_';

/**
 * 임시 저장 유틸리티
 * AsyncStorage를 사용하여 임시 데이터를 저장, 불러오기, 삭제하는 기능 제공
 */

/**
 * 데이터를 임시 저장합니다
 * @param key - 저장할 데이터의 고유 키
 * @param data - 저장할 데이터 (객체, 배열, 문자열 등)
 * @returns 성공 여부
 */
export const saveDraft = async <T>(key: string, data: T): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(`${DRAFT_PREFIX}${key}`, jsonValue);
    return true;
  } catch (error) {
    console.error('임시저장 실패:', error);
    return false;
  }
};

/**
 * 임시 저장된 데이터를 불러옵니다
 * @param key - 불러올 데이터의 고유 키
 * @returns 저장된 데이터 또는 null
 */
export const getDraft = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(`${DRAFT_PREFIX}${key}`);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('임시저장 불러오기 실패:', error);
    return null;
  }
};

/**
 * 임시 저장된 데이터를 삭제합니다
 * @param key - 삭제할 데이터의 고유 키
 * @returns 성공 여부
 */
export const deleteDraft = async (key: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(`${DRAFT_PREFIX}${key}`);
    return true;
  } catch (error) {
    console.error('임시저장 삭제 실패:', error);
    return false;
  }
};

/**
 * 모든 임시 저장 데이터의 키 목록을 가져옵니다
 * @returns 임시 저장된 모든 키 배열
 */
export const getAllDraftKeys = async (): Promise<string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys
      .filter((key) => key.startsWith(DRAFT_PREFIX))
      .map((key) => key.replace(DRAFT_PREFIX, ''));
  } catch (error) {
    console.error('임시저장 키 목록 조회 실패:', error);
    return [];
  }
};

/**
 * 모든 임시 저장 데이터를 삭제합니다
 * @returns 성공 여부
 */
export const clearAllDrafts = async (): Promise<boolean> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const draftKeys = keys.filter((key) => key.startsWith(DRAFT_PREFIX));
    await AsyncStorage.multiRemove(draftKeys);
    return true;
  } catch (error) {
    console.error('모든 임시저장 삭제 실패:', error);
    return false;
  }
};
