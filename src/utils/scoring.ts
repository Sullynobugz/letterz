export const calculatePoints = (secondsLeft: number, turnSeconds: number): number => {
  if (secondsLeft <= 0) return 0;
  const maxPoints = 100;
  return Math.round(maxPoints * (secondsLeft / turnSeconds));
};
