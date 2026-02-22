import React, { useState, useEffect } from 'react';
import type { ShareIntentData } from '../../types/shareIntent';
import DoLinkShareIntentView from '../DoLinkShareIntentView';

/**
 * Share Intent 진입 시 웹뷰를 띄워 로그인 여부를 브릿지로 확인하는 라우터
 */
export default function ShareIntentRouter(props: ShareIntentData) {
  console.log('ShareIntentRouter', props);
  const [shareIntent, setShareIntent] = useState<ShareIntentData | null>(null);

  // 로그인 여부는 DoLinkWebView 내부의 브릿지 통신을 통해 확인합니다.

  useEffect(() => {
    if (props.text || props.url || props.title) {
      setShareIntent({
        text: props.text || null,
        type: props.type || 'text',
        title: props.title || null,
        url: props.url || null,
        thumbnailUrl: props.thumbnailUrl || null,
      });
    }
  }, [props.text, props.title, props.url, props.thumbnailUrl, props.type]);

  // DoLinkWebView를 항상 렌더링하며, 내부에서 로그인 여부에 따라 분기 처리함

  return <DoLinkShareIntentView shareIntent={shareIntent} />;
}
