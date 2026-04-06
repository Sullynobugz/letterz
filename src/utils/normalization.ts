export const normalizeUmlaut = (char: string): string => {
  const map: Record<string, string> = {
    'Ä': 'A',
    'ä': 'A',
    'Ö': 'O',
    'ö': 'O',
    'Ü': 'U',
    'ü': 'U',
    'ß': 'S',
  };
  return map[char] || char.toUpperCase();
};

export const getFirstLetter = (word: string): string => {
  const trimmed = word.trim();
  if (!trimmed) return '';
  return normalizeUmlaut(trimmed[0]);
};

export const validateAnswer = (answer: string, selectedLetter: string): boolean => {
  const trimmed = answer.trim();
  if (!trimmed) return false;
  return getFirstLetter(trimmed) === selectedLetter.toUpperCase();
};

export const getAllLetters = (skipHardLetters: boolean): string[] => {
  const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  if (skipHardLetters) {
    return allLetters.filter(l => !['Q', 'X', 'Y'].includes(l));
  }
  return allLetters;
};
