import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const AUTH_STORAGE_KEY = 'auth-storage';
const AUTH_ACCESS_TOKEN_KEY = 'auth-storage.access-token';
const AUTH_REFRESH_TOKEN_KEY = 'auth-storage.refresh-token';

type PersistedAuthTokens = {
  accessToken?: string | null;
  refreshToken?: string | null;
};

type PersistedAuthState =
  | {
      state?: PersistedAuthTokens | null;
      version?: number;
    }
  | PersistedAuthTokens
  | null;

function getSharedAccessGroup(): string | null {
  const configuredAccessGroup = Constants.expoConfig?.extra
    ?.appleApplicationGroup as string | undefined;

  if (configuredAccessGroup) {
    return configuredAccessGroup;
  }

  const bundleIdentifier = Constants.expoConfig?.ios?.bundleIdentifier;
  if (Platform.OS === 'ios' && bundleIdentifier) {
    return `group.${bundleIdentifier}`;
  }

  return null;
}

function getTokenValue(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function getSharedSecureStoreOptions(): SecureStore.SecureStoreOptions {
  const accessGroup = Platform.OS === 'ios' ? getSharedAccessGroup() : null;
  return accessGroup ? { accessGroup } : {};
}

function parsePersistedAuthTokens(value: string | null): PersistedAuthTokens {
  if (!value) {
    return {};
  }

  try {
    const parsedValue = JSON.parse(value) as PersistedAuthState;
    const state =
      parsedValue &&
      typeof parsedValue === 'object' &&
      'state' in parsedValue &&
      parsedValue.state &&
      typeof parsedValue.state === 'object'
        ? parsedValue.state
        : parsedValue;

    if (!state || typeof state !== 'object') {
      return {};
    }

    const normalizedState = state as PersistedAuthTokens;

    return {
      accessToken: getTokenValue(normalizedState.accessToken),
      refreshToken: getTokenValue(normalizedState.refreshToken),
    };
  } catch {
    return {};
  }
}

function serializePersistedAuthTokens({
  accessToken,
  refreshToken,
}: PersistedAuthTokens): string {
  return JSON.stringify({
    state: {
      accessToken: accessToken ?? null,
      refreshToken: refreshToken ?? null,
    },
    version: 0,
  });
}

async function getLocalItem(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

async function setLocalItem(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value);
}

async function removeLocalItem(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}

async function getSharedItem(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key, getSharedSecureStoreOptions());
}

async function setSharedItem(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value, getSharedSecureStoreOptions());
}

async function removeSharedItem(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key, getSharedSecureStoreOptions());
}

async function migrateLegacyAuthStorage(): Promise<PersistedAuthTokens | null> {
  const legacyValue = await getLocalItem(AUTH_STORAGE_KEY);
  const legacyTokens = parsePersistedAuthTokens(legacyValue);

  if (!legacyTokens.accessToken && !legacyTokens.refreshToken) {
    return null;
  }

  await Promise.all([
    legacyTokens.accessToken
      ? setLocalItem(AUTH_ACCESS_TOKEN_KEY, legacyTokens.accessToken)
      : Promise.resolve(),
    legacyTokens.refreshToken
      ? setSharedItem(AUTH_REFRESH_TOKEN_KEY, legacyTokens.refreshToken)
      : Promise.resolve(),
    removeLocalItem(AUTH_STORAGE_KEY),
  ]);

  return legacyTokens;
}

export const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const authStorage = {
  async getItem(key: string): Promise<string | null> {
    if (key !== AUTH_STORAGE_KEY) {
      return getLocalItem(key);
    }

    const [accessToken, refreshToken] = await Promise.all([
      getLocalItem(AUTH_ACCESS_TOKEN_KEY),
      getSharedItem(AUTH_REFRESH_TOKEN_KEY),
    ]);

    if (accessToken || refreshToken) {
      return serializePersistedAuthTokens({ accessToken, refreshToken });
    }

    const migratedTokens = await migrateLegacyAuthStorage();
    if (!migratedTokens) {
      return null;
    }

    return serializePersistedAuthTokens(migratedTokens);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (key !== AUTH_STORAGE_KEY) {
      await setLocalItem(key, value);
      return;
    }

    const { accessToken, refreshToken } = parsePersistedAuthTokens(value);

    await Promise.all([
      accessToken
        ? setLocalItem(AUTH_ACCESS_TOKEN_KEY, accessToken)
        : removeLocalItem(AUTH_ACCESS_TOKEN_KEY),
      refreshToken
        ? setSharedItem(AUTH_REFRESH_TOKEN_KEY, refreshToken)
        : removeSharedItem(AUTH_REFRESH_TOKEN_KEY),
      removeLocalItem(AUTH_STORAGE_KEY),
    ]);
  },
  async removeItem(key: string): Promise<void> {
    if (key !== AUTH_STORAGE_KEY) {
      await removeLocalItem(key);
      return;
    }

    await Promise.all([
      removeLocalItem(AUTH_ACCESS_TOKEN_KEY),
      removeSharedItem(AUTH_REFRESH_TOKEN_KEY),
      removeLocalItem(AUTH_STORAGE_KEY),
    ]);
  },
};
