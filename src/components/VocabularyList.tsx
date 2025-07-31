import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Volume2, Heart, Check, BookOpen, Filter, SortAsc, Eye } from 'lucide-react';

interface Word {
  word: string;
  pronunciation: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
}

interface VocabularyListProps {
  category: string;
  onBack: () => void;
  onStartFlashcards: () => void;
}

const VocabularyList: React.FC<VocabularyListProps> = ({ category, onBack, onStartFlashcards }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState('all');
  const [sortBy, setSortBy] = useState('alphabetical');
  const [favoriteWords, setFavoriteWords] = useState<Set<string>>(new Set());
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());

  const categoryInfo: { [key: string]: { name: string; color: string; gradient: string } } = {
    oxford_a1: { name: 'A1 - Beginner', color: 'text-emerald-600', gradient: 'from-emerald-400 to-emerald-600' },
    oxford_a2: { name: 'A2 - Elementary', color: 'text-blue-600', gradient: 'from-blue-400 to-blue-600' },
    oxford_b1: { name: 'B1 - Intermediate', color: 'text-purple-600', gradient: 'from-purple-400 to-purple-600' },
    oxford_b2: { name: 'B2 - Upper-Intermediate', color: 'text-orange-600', gradient: 'from-orange-400 to-orange-600' },
    oxford_c1: { name: 'C1 - Advanced', color: 'text-red-600', gradient: 'from-red-400 to-red-600' },
    oxford_c2: { name: 'C2 - Proficiency', color: 'text-indigo-600', gradient: 'from-indigo-400 to-indigo-600' },
    toeic: { name: 'TOEIC Vocabulary', color: 'text-slate-700', gradient: 'from-slate-600 to-slate-800' }
  };

  useEffect(() => {
    loadWords();
  }, [category]);

  useEffect(() => {
    filterAndSortWords();
  }, [words, searchTerm, selectedPartOfSpeech, sortBy]);

  const loadWords = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/${category}.csv`);
      if (!response.ok) {
        throw new Error(`Failed to load ${category} data`);
      }
      
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      const wordsData = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
          word: values[0]?.replace(/"/g, '') || '',
          pronunciation: values[1]?.replace(/"/g, '') || '',
          meaning: values[2]?.replace(/"/g, '') || '',
          partOfSpeech: values[3]?.replace(/"/g, '') || '',
          example: values[4]?.replace(/"/g, '') || ''
        };
      }).filter(word => word.word);

      setWords(wordsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load words');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortWords = () => {
    let filtered = words.filter(word => {
      const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           word.meaning.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPartOfSpeech = selectedPartOfSpeech === 'all' || word.partOfSpeech === selectedPartOfSpeech;
      return matchesSearch && matchesPartOfSpeech;
    });

    // Sort words
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.word.localeCompare(b.word);
        case 'partOfSpeech':
          return a.partOfSpeech.localeCompare(b.partOfSpeech);
        default:
          return 0;
      }
    });

    setFilteredWords(filtered);
  };

  const getUniquePartsOfSpeech = () => {
    const parts = [...new Set(words.map(word => word.partOfSpeech))].filter(Boolean);
    return parts.sort();
  };

  const speakWord = (word: string) => {
    if (!('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const toggleFavorite = (word: string) => {
    setFavoriteWords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(word)) {
        newSet.delete(word);
      } else {
        newSet.add(word);
      }
      return newSet;
    });
  };

  const toggleKnown = (word: string) => {
    setKnownWords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(word)) {
        newSet.delete(word);
      } else {
        newSet.add(word);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">กำลังโหลดคำศัพท์...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md border border-red-100">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onBack}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300"
          >
            กลับไปเลือกหมวดหมู่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              กลับ
            </button>
            
            <div className="text-center">
              <h1 className={`text-2xl font-bold ${categoryInfo[category]?.color || 'text-gray-800'}`}>
                {categoryInfo[category]?.name || category}
              </h1>
              <p className="text-sm text-gray-500">
                {filteredWords.length} คำศัพท์
              </p>
            </div>
            
            <button
              onClick={onStartFlashcards}
              className={`px-6 py-3 bg-gradient-to-r ${categoryInfo[category]?.gradient || 'from-purple-400 to-purple-600'} text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium`}
            >
              เริ่มเรียน Flashcards
            </button>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ค้นหาคำศัพท์..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Part of Speech Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedPartOfSpeech}
                onChange={(e) => setSelectedPartOfSpeech(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">ทุกประเภท</option>
                {getUniquePartsOfSpeech().map(part => (
                  <option key={part} value={part}>{part}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="alphabetical">เรียงตามตัวอักษร</option>
                <option value="partOfSpeech">เรียงตามประเภทคำ</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Word List */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {filteredWords.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">ไม่พบคำศัพท์</h3>
            <p className="text-gray-500">ลองเปลี่ยนคำค้นหาหรือตัวกรองดู</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWords.map((word, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-bold text-gray-800 mr-3">{word.word}</h3>
                      <button
                        onClick={() => speakWord(word.word)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                      >
                        <Volume2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    
                    {word.pronunciation && (
                      <p className="text-sm text-gray-500 mb-2">/{word.pronunciation}/</p>
                    )}
                    
                    <span className={`inline-block px-3 py-1 bg-gradient-to-r ${categoryInfo[category]?.gradient || 'from-gray-100 to-gray-200'} text-white text-xs font-medium rounded-full mb-3`}>
                      {word.partOfSpeech}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleFavorite(word.word)}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        favoriteWords.has(word.word)
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favoriteWords.has(word.word) ? 'fill-current' : ''}`} />
                    </button>
                    
                    <button
                      onClick={() => toggleKnown(word.word)}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        knownWords.has(word.word)
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-gray-700 leading-relaxed">{word.meaning}</p>
                  
                  {word.example && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                      <p className="text-sm text-gray-700 italic">"{word.example}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-purple-100 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <Heart className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-xl font-bold text-gray-800">{favoriteWords.size}</span>
              </div>
              <p className="text-sm text-gray-600">คำโปรด</p>
            </div>
            
            <div>
              <div className="flex items-center justify-center mb-2">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-xl font-bold text-gray-800">{knownWords.size}</span>
              </div>
              <p className="text-sm text-gray-600">รู้แล้ว</p>
            </div>
            
            <div>
              <div className="flex items-center justify-center mb-2">
                <Eye className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-gray-800">{filteredWords.length}</span>
              </div>
              <p className="text-sm text-gray-600">กำลังดู</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyList;