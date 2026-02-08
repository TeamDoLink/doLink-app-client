import React, { useState, useEffect } from 'react';
import { BackHandler, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DoLinkWebView from '../DoLinkWebView';
import type { ShareIntentData } from '../../types/shareIntent';

const AUTH_KEY = '@dolink_is_logged_in';

/**
 * Share Intent 진입 시 로그인 여부에 따라 분기하는 라우터
 * - 로그인 O → DoLinkWebView (BottomSheet WebView)
 * - 로그인 X → 메인 앱으로 이동 (딥링크)
 */
export default function ShareIntentRouter(props: ShareIntentData) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [shareIntent, setShareIntent] = useState<ShareIntentData | null>(null);

  // TODO 웹에서 브릿지 따서 받아와야함.

  useEffect(() => {
    // AsyncStorage.getItem(AUTH_KEY).then((value) => {
    //   setIsLoggedIn(value === 'true');
    // });
    setIsLoggedIn(true);
  }, []);

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

  useEffect(() => {
    //  미로그인 시 메인 앱으로 이동
    if (isLoggedIn === false) {
      Linking.openURL('dolink://');
      BackHandler.exitApp();
    }
  }, [isLoggedIn]);

  // 로딩 중이거나 미로그인(앱 이동 중)이면 아무것도 렌더하지 않음
  if (!isLoggedIn) return null;

  return <DoLinkWebView shareIntent={shareIntent} />;
}
