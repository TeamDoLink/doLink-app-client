import {
  IOSShareExtensionData,
  ShareIntentData,
  ShareIntentInput,
} from '@/src/types/shareIntent';

const URL_PATTERN = /https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/i;

function toTrimmedString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function extractUrlFromText(text?: string | null): string | null {
  const source = toTrimmedString(text);
  if (!source) {
    return null;
  }

  return source.match(URL_PATTERN)?.[0] ?? null;
}

function stripUrlFromText(
  text?: string | null,
  extractedUrl?: string | null,
): string | null {
  const source = toTrimmedString(text);
  if (!source) {
    return null;
  }

  const url = toTrimmedString(extractedUrl);
  if (!url) {
    return source;
  }

  const normalizedText = source.replace(url, '').replace(/\s+/g, ' ').trim();
  return normalizedText.length > 0 ? normalizedText : null;
}

function normalizeType(
  type: ShareIntentData['type'],
  url?: string | null,
  text?: string | null,
): ShareIntentData['type'] {
  if (type) {
    return type;
  }

  if (url) {
    return 'weburl';
  }

  if (text) {
    return 'text';
  }

  return null;
}

function getPreprocessingResult(
  input: ShareIntentInput,
): IOSShareExtensionData['preprocessingResults'] | null {
  if (!input || !('preprocessingResults' in input)) {
    return null;
  }

  const preprocessingResults = input.preprocessingResults;
  if (
    preprocessingResults === null ||
    typeof preprocessingResults !== 'object' ||
    Array.isArray(preprocessingResults)
  ) {
    return null;
  }

  return preprocessingResults as IOSShareExtensionData['preprocessingResults'];
}

export function normalizeShareIntentData(
  input: ShareIntentInput,
): ShareIntentData {
  const preprocessingResults = getPreprocessingResult(input);
  const shareIntent = input as ShareIntentData | null | undefined;
  const rawText = toTrimmedString(input?.text);
  const url =
    toTrimmedString(input?.url) ??
    toTrimmedString(preprocessingResults?.baseURI) ??
    extractUrlFromText(rawText);
  const text = stripUrlFromText(rawText, url);
  const title =
    ('title' in (input ?? {}) ? toTrimmedString(shareIntent?.title) : null) ??
    toTrimmedString(preprocessingResults?.title);

  return {
    text,
    title,
    url,
    thumbnailUrl:
      'thumbnailUrl' in (input ?? {})
        ? toTrimmedString(shareIntent?.thumbnailUrl)
        : null,
    type: normalizeType(
      'type' in (input ?? {}) ? (shareIntent?.type ?? null) : null,
      url,
      text,
    ),
  };
}

export function hasShareIntentContent(
  shareIntent?: ShareIntentData | null,
): boolean {
  return Boolean(shareIntent?.url || shareIntent?.text || shareIntent?.title);
}

export function getShareIntentTaskTitle(
  shareIntent?: ShareIntentData | null,
): string {
  return (
    toTrimmedString(shareIntent?.title) ??
    toTrimmedString(shareIntent?.text) ??
    toTrimmedString(shareIntent?.url) ??
    ''
  );
}
