export const getNearestStep = (steps: number[], bottomSheetHeight: number) => {
  let nearestStep = steps[0];
  let minDistance = Math.abs(bottomSheetHeight - steps[0]);
  for (let i = 1; i < steps.length; i++) {
    const distance = Math.abs(bottomSheetHeight - steps[i]);
    if (distance < minDistance) {
      nearestStep = steps[i];
      minDistance = distance;
    }
  }
  return nearestStep;
};
