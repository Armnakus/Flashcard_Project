import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Shuffle, RotateCcw, Volume2, Heart, Check, BookOpen, Target, RefreshCw } from 'lucide-react';

interface Word {
  word: string;
  pronunciation: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
}

interface FlashcardPageProps {
  category: string;
  onBack: () => void;
}

type StudyMode = 'flashcard' | 'quiz';

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface WrongAnswer {
  word: string;
  correctAnswer: string;
  userAnswer: string;
  questionNumber: number;
}const FlashcardPage: React.FC<FlashcardPageProps> = ({ category, onBack }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteWords, setFavoriteWords] = useState<Set<string>>(new Set());
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
  const [streak, setStreak] = useState(0);
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcard');
  
  // Quiz mode states
  const [quizOptions, setQuizOptions] = useState<QuizOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentQuizWord, setCurrentQuizWord] = useState<Word | null>(null);
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const categoryInfo: { [key: string]: { name: string; color: string; gradient: string } } = {
    oxford_a1: { name: 'A1 - Beginner', color: 'text-green-600', gradient: 'from-green-400 to-green-600' },
    oxford_a2: { name: 'A2 - Elementary', color: 'text-blue-600', gradient: 'from-blue-400 to-blue-600' },
    oxford_b1: { name: 'B1 - Intermediate', color: 'text-purple-600', gradient: 'from-purple-400 to-purple-600' },
    oxford_b2: { name: 'B2 - Upper-Intermediate', color: 'text-orange-600', gradient: 'from-orange-400 to-orange-600' },
    oxford_c1: { name: 'C1 - Advanced', color: 'text-red-600', gradient: 'from-red-400 to-red-600' },
    oxford_c2: { name: 'C2 - Proficiency', color: 'text-indigo-600', gradient: 'from-indigo-400 to-indigo-600' },
    toeic: { name: 'TOEIC Vocabulary', color: 'text-gray-700', gradient: 'from-gray-600 to-gray-800' }
  };

  useEffect(() => {
    loadWords();
  }, [category]);

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
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load words');
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuizQuestion = () => {
    if (words.length < 4) return; // Need at least 4 words for multiple choice
    
    // Select a random word for the question
    const randomIndex = Math.floor(Math.random() * words.length);
    const correctWord = words[randomIndex];
    setCurrentQuizWord(correctWord);
    
    // Generate 3 wrong answers
    const wrongAnswers = words
      .filter((_, index) => index !== randomIndex)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((word, index) => ({ id: `wrong_${index}`, text: word.meaning, isCorrect: false }));
    
    // Add the correct answer
    const correctAnswer = { id: 'correct', text: correctWord.meaning, isCorrect: true };
    
    // Shuffle all options
    const allOptions = [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5);
    
    setQuizOptions(allOptions);
    setSelectedOption(null);
    setShowResult(false);
  };

  const handleQuizAnswer = (optionIndex: number) => {
    if (selectedOption !== null) return; // Already answered
    
    setSelectedOption(optionIndex);
    setShowResult(true);
    setTotalQuestions(prev => prev + 1);
    
    if (quizOptions[optionIndex].isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
      // บันทึกข้อที่ตอบผิด
      if (currentQuizWord) {
        const wrongAnswer: WrongAnswer = {
          word: currentQuizWord.word,
          correctAnswer: currentQuizWord.meaning,
          userAnswer: quizOptions[optionIndex].text,
          questionNumber: totalQuestions + 1
        };
        setWrongAnswers(prev => [...prev, wrongAnswer]);
      }
    }
  };

  const nextQuizQuestion = () => {
    if (totalQuestions >= maxQuestions) {
      setQuizCompleted(true);
      return;
    }
    generateQuizQuestion();
  };

  const resetQuiz = () => {
    setScore(0);
    setTotalQuestions(0);
    setStreak(0);
    setWrongAnswers([]);
    setQuizCompleted(false);
    generateQuizQuestion();
  };

  const switchToFlashcardMode = () => {
    setStudyMode('flashcard');
    setSelectedOption(null);
    setShowResult(false);
  };

  const switchToQuizMode = () => {
    setStudyMode('quiz');
    setScore(0);
    setTotalQuestions(0);
    setStreak(0);
    setWrongAnswers([]);
    setQuizCompleted(false);
    setCurrentQuizWord(null);
    setQuizOptions([]);
    setSelectedOption(null);
    setShowResult(false);
    setMaxQuestions(10); // รีเซ็ตเป็นค่าเริ่มต้น
  };

  const currentWord = words[currentIndex];
  const progress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0;

  const nextCard = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const shuffleWords = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const resetOrder = () => {
    loadWords();
  };

  const toggleFavorite = () => {
    const currentWord = words[currentIndex];
    if (!currentWord) return;
    
    setFavoriteWords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentWord.word)) {
        newSet.delete(currentWord.word);
      } else {
        newSet.add(currentWord.word);
      }
      return newSet;
    });
  };

  const toggleKnown = () => {
    const currentWord = words[currentIndex];
    if (!currentWord) return;
    
    setKnownWords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentWord.word)) {
        newSet.delete(currentWord.word);
      } else {
        newSet.add(currentWord.word);
        setStreak(prevStreak => prevStreak + 1);
      }
      return newSet;
    });
  };

  const speakWord = () => {
    const currentWord = words[currentIndex];
    if (!currentWord || !('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">กำลังโหลดคำศัพท์...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md border border-red-100">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={loadWords}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300"
            >
              ลองใหม่อีกครั้ง
            </button>
            <button
              onClick={onBack}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
            >
              กลับไปเลือกหมวดหมู่
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentWord || words.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ไม่พบคำศัพท์</h2>
          <p className="text-gray-600 mb-6">ไม่มีคำศัพท์สำหรับหมวดหมู่นี้</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300"
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Top Row - Simple Layout */}
          <div className="flex items-center justify-between">
            {/* Left - Back Button */}
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">กลับ</span>
            </button>
            
            {/* Center - Title */}
            <div className="text-center">
              <h1 className={`text-lg sm:text-xl font-bold ${categoryInfo[category]?.color || 'text-gray-800'}`}>
                {categoryInfo[category]?.name || category}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                {studyMode === 'flashcard' 
                  ? `${currentIndex + 1} / ${words.length}` 
                  : `คะแนน: ${score}/${totalQuestions} | Streak: ${streak}`
                }
              </p>
            </div>
            
            {/* Right - Empty for balance */}
            <div className="w-16 sm:w-20"></div>
          </div>
          
          {/* Controls Row */}
          <div className="flex items-center justify-center mt-3 space-x-2">
            {/* Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={switchToFlashcardMode}
                className={`px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  studyMode === 'flashcard'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                <span className="hidden sm:inline">Flashcard</span>
              </button>
              <button
                onClick={switchToQuizMode}
                className={`px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  studyMode === 'quiz'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Target className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                <span className="hidden sm:inline">Quiz</span>
              </button>
            </div>
            
            {studyMode === 'flashcard' && (
              <>
                <button
                  onClick={shuffleWords}
                  className="p-1.5 sm:p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                  title="สลับลำดับ"
                >
                  <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={resetOrder}
                  className="p-1.5 sm:p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                  title="รีเซ็ต"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 sm:mt-4">
            <div className="w-full bg-purple-100 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${categoryInfo[category]?.gradient || 'from-purple-400 to-purple-600'} h-2 rounded-full transition-all duration-500`}
                style={{ 
                  width: studyMode === 'flashcard' 
                    ? `${progress}%` 
                    : totalQuestions > 0 ? `${(score / totalQuestions) * 100}%` : '0%'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {studyMode === 'quiz' ? (
          /* Quiz Mode */
          quizCompleted ? (
            /* Quiz Results */
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 text-center">
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🎉</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Quiz เสร็จสิ้น!</h2>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-green-50 rounded-xl p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-xs sm:text-sm text-green-700">ถูก</div>
                </div>
                <div className="bg-red-50 rounded-xl p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold text-red-600">{totalQuestions - score}</div>
                  <div className="text-xs sm:text-sm text-red-700">ผิด</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">{Math.round((score / totalQuestions) * 100)}%</div>
                  <div className="text-xs sm:text-sm text-blue-700">คะแนน</div>
                </div>
              </div>

              {wrongAnswers.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">คำที่ตอบผิด:</h3>
                  <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-60 overflow-y-auto">
                    {wrongAnswers.map((wrong, index) => (
                      <div key={index} className="bg-red-50 rounded-lg p-3 sm:p-4 text-left">
                        <div className="font-semibold text-red-800 text-sm sm:text-base">{wrong.word}</div>
                        <div className="text-xs sm:text-sm text-red-600">คำตอบที่ถูก: {wrong.correctAnswer}</div>
                        <div className="text-xs sm:text-sm text-red-500">คำตอบของคุณ: {wrong.userAnswer}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={resetQuiz}
                  className={`w-full px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r ${categoryInfo[category]?.gradient || 'from-purple-400 to-purple-600'} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium transform hover:scale-105 text-sm sm:text-base`}
                >
                  เริ่ม Quiz ใหม่
                </button>
                <button
                  onClick={switchToFlashcardMode}
                  className="w-full px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium text-sm sm:text-base"
                >
                  กลับไป Flashcard
                </button>
              </div>
            </div>
          ) : !currentQuizWord ? (
            /* Quiz Setup */
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 text-center">
              <div className="text-4xl mb-6">🎯</div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">เลือกจำนวนข้อสอบ</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
                {[10, 20, 50].map((num) => (
                  <button
                    key={num}
                    onClick={() => setMaxQuestions(num)}
                    className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${
                      maxQuestions === num
                        ? `border-orange-400 bg-gradient-to-r ${categoryInfo[category]?.gradient || 'from-purple-400 to-purple-600'} text-white shadow-lg`
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl font-bold">{num}</div>
                    <div className="text-sm">ข้อ</div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  if (maxQuestions > 0) {
                    setTotalQuestions(0);
                    setScore(0);
                    setStreak(0);
                    setWrongAnswers([]);
                    setQuizCompleted(false);
                    generateQuizQuestion();
                  }
                }}
                disabled={maxQuestions === 0}
                className={`w-full px-6 sm:px-8 py-3 bg-gradient-to-r ${categoryInfo[category]?.gradient || 'from-purple-400 to-purple-600'} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                เริ่มทำ Quiz ({maxQuestions} ข้อ)
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {currentQuizWord && (
                <>
                  {/* Quiz Question */}
                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
                      <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-0 sm:mr-4">{currentQuizWord.word}</h2>
                      <button
                        onClick={() => {
                          if ('speechSynthesis' in window) {
                            const utterance = new SpeechSynthesisUtterance(currentQuizWord.word);
                            utterance.lang = 'en-US';
                            utterance.rate = 0.8;
                            speechSynthesis.speak(utterance);
                          }
                        }}
                        className="p-2 sm:p-3 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110"
                      >
                        <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                      </button>
                    </div>
                    
                    {currentQuizWord.pronunciation && (
                      <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">/{currentQuizWord.pronunciation}/</p>
                    )}
                    
                    <div className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r ${categoryInfo[category]?.gradient || 'from-gray-100 to-gray-200'} text-white rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6`}>
                      {currentQuizWord.partOfSpeech}
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">เลือกความหมายที่ถูกต้อง:</h3>
                  </div>

                  {/* Quiz Options */}
                  <div className="space-y-2 sm:space-y-3">
                    {quizOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(index)}
                        disabled={selectedOption !== null}
                        className={`w-full p-3 sm:p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                          selectedOption === null
                            ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                            : selectedOption === index
                            ? option.isCorrect
                              ? 'border-green-500 bg-green-50 text-green-800'
                              : 'border-red-500 bg-red-50 text-red-800'
                            : option.isCorrect && showResult
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : 'border-gray-200 bg-gray-50 text-gray-500'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs sm:text-sm font-medium mr-2 sm:mr-3 flex-shrink-0">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1 text-sm sm:text-base">{option.text}</span>
                          {showResult && selectedOption === index && (
                            <span className="ml-2 text-lg">
                              {option.isCorrect ? '✅' : '❌'}
                            </span>
                          )}
                          {showResult && option.isCorrect && selectedOption !== index && (
                            <span className="ml-2 text-lg">✅</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Result and Next Button */}
                  {showResult && (
                    <div className="mt-6 sm:mt-8 text-center">
                      <div className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
                        quizOptions[selectedOption!]?.isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {quizOptions[selectedOption!]?.isCorrect ? '🎉 ถูกต้อง!' : '❌ ผิด!'}
                      </div>
                      
                      {currentQuizWord.example && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-100 mb-4 sm:mb-6">
                          <p className="text-gray-700 italic text-xs sm:text-sm">
                            ตัวอย่าง: "{currentQuizWord.example}"
                          </p>
                        </div>
                      )}
                      
                      {totalQuestions < maxQuestions ? (
                        <button
                          onClick={nextQuizQuestion}
                          className={`px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r ${categoryInfo[category]?.gradient || 'from-purple-400 to-purple-600'} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium transform hover:scale-105 text-sm sm:text-base`}
                        >
                          <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                          คำถามถัดไป
                        </button>
                      ) : (
                        <button
                          onClick={() => setQuizCompleted(true)}
                          className={`px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r ${categoryInfo[category]?.gradient || 'from-purple-400 to-purple-600'} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium transform hover:scale-105 text-sm sm:text-base`}
                        >
                          ดูผลลัพธ์
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
                )}
              </div>
            )
        ) : (
          /* Flashcard Mode */
          <>
            {/* Flashcard */}
            <div className="relative mb-8">
          <div
            className={`flashcard-container ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front of card */}
            <div className="flashcard-front bg-white rounded-3xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 border border-gray-100 min-h-[400px] flex items-center justify-center">
              <div className="text-center w-full">
                <div className="flex items-center justify-center mb-6">
                  <h2 className="text-5xl font-bold text-gray-800 mr-4">{currentWord.word}</h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord();
                    }}
                    className="p-3 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110"
                  >
                    <Volume2 className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
                
                {currentWord.pronunciation && (
                  <p className="text-xl text-gray-600 mb-6">/{currentWord.pronunciation}/</p>
                )}
                
                <div className={`inline-block px-6 py-3 bg-gradient-to-r ${categoryInfo[category]?.gradient || 'from-gray-100 to-gray-200'} text-white rounded-full text-sm font-medium mb-8`}>
                  {currentWord.partOfSpeech}
                </div>
                
                <div className="animate-pulse">
                  <p className="text-gray-500">แตะเพื่อดูความหมาย</p>
                </div>
              </div>
            </div>

            {/* Back of card */}
            <div className="flashcard-back bg-white rounded-3xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 border border-gray-100 min-h-[400px] flex items-center justify-center">
              <div className="text-center w-full">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">{currentWord.word}</h3>
                
                <div className="space-y-6 mb-8">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    {currentWord.meaning}
                  </p>
                  
                  {currentWord.example && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <p className="text-gray-700 italic">
                        "{currentWord.example}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex justify-center space-x-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite();
                    }}
                    className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      favoriteWords.has(currentWord.word)
                        ? 'bg-red-100 text-red-600 shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${favoriteWords.has(currentWord.word) ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleKnown();
                    }}
                    className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      knownWords.has(currentWord.word)
                        ? 'bg-green-100 text-green-600 shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                    }`}
                  >
                    <Check className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={prevCard}
            disabled={currentIndex === 0}
            className="px-8 py-4 bg-white text-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ก่อนหน้า
          </button>
          
          <button
            onClick={nextCard}
            disabled={currentIndex === words.length - 1}
            className={`px-8 py-4 bg-gradient-to-r ${categoryInfo[category]?.gradient || 'from-blue-400 to-blue-600'} text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            ถัดไป
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-lg text-center border border-gray-100">
            <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-800">{favoriteWords.size}</div>
            <div className="text-sm text-gray-600">คำโปรด</div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-lg text-center border border-gray-100">
            <Check className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-800">{knownWords.size}</div>
            <div className="text-sm text-gray-600">รู้แล้ว</div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-lg text-center border border-gray-100">
            <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-800">{words.length}</div>
            <div className="text-sm text-gray-600">ทั้งหมด</div>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FlashcardPage;