import { Redirect, useLocalSearchParams } from 'expo-router';

/**
 * Catch-all 라우트
 * 딥링크로 들어온 미매칭 경로를 index로 redirect
 * initialPath query param으로 경로를 전달
 */
export default function UnmatchedRoute() {
  const { unmatched } = useLocalSearchParams<{ unmatched: string[] }>();
  const path = Array.isArray(unmatched)
    ? `/${unmatched.join('/')}`
    : unmatched
      ? `/${unmatched}`
      : '/';

  return <Redirect href={{ pathname: '/', params: { initialPath: path } }} />;
}
