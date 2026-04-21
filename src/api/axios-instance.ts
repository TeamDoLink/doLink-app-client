import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '@/src/stores/useAuthStore';

// ==============================
// Axios 기본 인스턴스 생성
// ==============================
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const AXIOS_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ==============================
// Request 인터셉터: access token을 Authorization 헤더에 첨부
// ==============================
AXIOS_INSTANCE.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken, refreshToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (refreshToken) {
      // 서버는 HttpOnly `refresh` 쿠키를 기대합니다. (Cookie: refresh=<token>)
      // RN(Axios) 환경에선 CookieJar 자동 전송이 불안정할 수 있어 헤더로 명시합니다.
      config.headers.Cookie = `refresh=${refreshToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ==============================
// Response 인터셉터: 401 응답 시 토큰 갱신 후 원래 요청 재시도
// ==============================
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401이 아니거나 이미 재시도한 요청 → 그냥 에러 reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // reissue 엔드포인트 자체의 401은 인터셉터에서 제외 (무한 루프 방지)
    if (originalRequest.url === '/v1/auth/reissue') {
      return Promise.reject(error);
    }

    // 이미 refresh 진행 중이면 큐에 저장
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(AXIOS_INSTANCE(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await AXIOS_INSTANCE.post('/v1/auth/reissue');
      const newToken: string = response.data?.result;

      if (newToken) {
        useAuthStore.getState().setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return AXIOS_INSTANCE(originalRequest);
      } else {
        throw new Error('토큰 갱신 응답이 올바르지 않습니다');
      }
    } catch (refreshError) {
      useAuthStore.getState().clearAuth();
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// ==============================
// Orval v8용 커스텀 요청 함수
// Fetch API 스타일 config를 Axios 요청으로 변환
// ==============================
export const customInstance = <T>(
  url: string, // 요청 경로
  config: RequestInit, // Fetch API 스타일 요청 옵션
): Promise<T> => {
  // ==============================
  // 요청 취소 토큰 생성
  // ==============================
  const source = axios.CancelToken.source();

  // ==============================
  // Axios 요청 실행
  // ==============================
  const promise = AXIOS_INSTANCE({
    url, // 요청 URL
    method: config.method as string, // HTTP 메서드 변환
    headers: config.headers as Record<string, string>, // 헤더 변환
    data: config.body, // 요청 바디 변환
    cancelToken: source.token, // 취소 토큰 연결
  }).then(({ data }) => data); // 응답에서 data만 반환

  // ==============================
  // promise에 cancel 메서드 추가
  // (원래 Promise에는 없어서 TS 에러 방지)
  // ==============================
  // @ts-expect-error cancel 속성 추가
  promise.cancel = () => source.cancel('Query cancelled');

  return promise; // 최종 Promise 반환
};
