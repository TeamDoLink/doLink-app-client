import { useInfiniteQuery } from '@tanstack/react-query';
import {
  getSearchCollectionsQueryKey,
  searchCollections,
} from '@/src/api/generated/endpoints/search/search';
import type { ApiResponseSliceCollectionResponse } from '@/src/api/generated/models';

export const COLLECTION_PAGE_SIZE_DEFAULT = 20;

export function collectionSliceGetNextPageParam(
  lastPage: ApiResponseSliceCollectionResponse,
): number | undefined {
  const slice = lastPage?.result;
  if (slice?.last || slice?.empty) {
    return undefined;
  }
  return (slice?.number ?? 0) + 1;
}

/**
 * `/api/v1/search/collections` 무한 스크롤. `keyword`는 trim 후 전달(빈 문자열이면 서버 정책에 따름).
 */
export function useSearchCollections(
  keyword: string,
  pageSize: number = COLLECTION_PAGE_SIZE_DEFAULT,
) {
  const trimmedKeyword = keyword.trim();

  return useInfiniteQuery({
    queryKey: [
      ...getSearchCollectionsQueryKey({
        keyword: trimmedKeyword,
        size: pageSize,
      }),
      'infinite',
    ] as const,
    queryFn: async ({ pageParam, signal }) => {
      return searchCollections(
        {
          keyword: trimmedKeyword,
          page: pageParam as number,
          size: pageSize,
        },
        { signal },
      ) as Promise<ApiResponseSliceCollectionResponse>;
    },
    initialPageParam: 0,
    getNextPageParam: collectionSliceGetNextPageParam,
  });
}
