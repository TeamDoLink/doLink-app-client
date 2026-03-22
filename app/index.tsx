import { useState, useEffect, useMemo } from 'react';
import { StatusBar, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { config } from '@/src/utils/envConfig';
import DebugButton from '@/src/components/DebugButton';
import DoLinkWebView from '@/src/components/DoLinkWebView';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

export default function Index() {
  const domain = config.domain;

  const rootWebUrl = useMemo(() => {
    const normalizedDomain = domain.endsWith('/')
      ? domain.slice(0, -1)
      : domain;
    return `${normalizedDomain}/`;
  }, [domain]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      edges={Platform.OS === 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <DoLinkWebView source={{ uri: rootWebUrl }} />
      </KeyboardAvoidingView>
      <DebugButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  testButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  testButtonText: {
    fontSize: 28,
  },
});
