const defaultVariable = {
  level: 0,
  exp: 0,
  baseExp: 100,
  rate: 1.375,
};

export const calcNextLevelExp = (currentLevel: number): number => {
  if (currentLevel === 0) return defaultVariable.baseExp;

  return Math.round(defaultVariable.baseExp * (currentLevel * defaultVariable.rate));
};

export const calcNextLevelExpRequired = ({
  currentLevel,
  currentExp,
}: {
  currentLevel: number;
  currentExp: number;
}): number => {
  if (currentLevel === 0) return defaultVariable.baseExp;

  return Math.round(defaultVariable.baseExp * (currentLevel * defaultVariable.rate) - currentExp);
};

export const isLevelUp = ({ currentLevel, currentExp }: { currentLevel: number; currentExp: number }): boolean => {
  const nextExpRequire = calcNextLevelExp(currentLevel);

  return currentExp < nextExpRequire ? false : true;
};
