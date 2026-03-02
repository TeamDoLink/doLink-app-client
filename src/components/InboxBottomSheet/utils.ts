/**
 * steps: 0 ~ 100 사이의 값, 바텀시트 %
 * deviceHeight: 디바이스 높이
 * bottomSheetHeight: 바텀시트 높이
 */
export const getNearestStepIndex = (
  steps: number[],
  deviceHeight: number,
  bottomSheetHeight: number,
) => {
  const stepHeights = steps.map((step) => deviceHeight * (step / 100));
  const distances = stepHeights.map((stepHeight) =>
    Math.abs(bottomSheetHeight - stepHeight),
  );

  let minDistance = distances[0];
  let minIndex = 0;
  for (let i = 1; i < distances.length; i++) {
    if (distances[i] < minDistance) {
      minDistance = distances[i];
      minIndex = i;
    }
  }
  return minIndex;
};
