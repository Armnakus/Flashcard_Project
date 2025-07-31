export interface Word {
  word: string;
  pronunciation: string;
  meaning: string;
  partOfSpeech: string;
  example?: string;
}

export const parseCSV = (csvText: string): Word[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const word: Word = {
      word: values[0] || '',
      pronunciation: values[1] || '',
      meaning: values[2] || '',
      partOfSpeech: values[3] || '',
      example: values[4] || undefined
    };
    return word;
  });
};

// Helper function to properly parse CSV lines with commas in quoted fields
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

export const loadWordsFromCSV = async (csvPath: string): Promise<Word[]> => {
  try {
    const response = await fetch(csvPath);
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading CSV:', error);
    return [];
  }
};