import React, { useState, useEffect } from 'react';
import { BookOpen, Star, Trophy, Users, ArrowRight, Globe, Target, Award, Zap, Sparkles, Eye, Play } from 'lucide-react';

interface CategorySelectorProps {
  onCategorySelect: (category: string) => void;
  onViewVocabulary: (category: string) => void;
}

interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  level: string;
  color: string;
  gradient: string;
  wordCount: number;
  icon: React.ReactNode;
  image: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ onCategorySelect, onViewVocabulary }) => {
  const [wordCounts, setWordCounts] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  const categories: CategoryInfo[] = [
    {
      id: 'oxford_a1',
      name: 'A1',
      description: 'เริ่มต้นเรียนรู้',
      level: 'Beginner',
      color: 'text-emerald-600',
      gradient: 'from-emerald-400 to-emerald-600',
      wordCount: wordCounts.oxford_a1 || 0,
      icon: <Star className="w-5 h-5" />,
      image: '/photo/A1.png'
    },
    {
      id: 'oxford_a2',
      name: 'A2',
      description: 'พื้นฐานที่แข็งแกร่ง',
      level: 'Elementary',
      color: 'text-blue-600',
      gradient: 'from-blue-400 to-blue-600',
      wordCount: wordCounts.oxford_a2 || 0,
      icon: <Target className="w-5 h-5" />,
      image: '/photo/A2.png'
    },
    {
      id: 'oxford_b1',
      name: 'B1',
      description: 'ก้าวสู่ระดับกลาง',
      level: 'Intermediate',
      color: 'text-purple-600',
      gradient: 'from-purple-400 to-purple-600',
      wordCount: wordCounts.oxford_b1 || 0,
      icon: <Globe className="w-5 h-5" />,
      image: '/photo/B1.png'
    },
    {
      id: 'oxford_b2',
      name: 'B2',
      description: 'มั่นใจในการสื่อสาร',
      level: 'Upper-Intermediate',
      color: 'text-orange-600',
      gradient: 'from-orange-400 to-orange-600',
      wordCount: wordCounts.oxford_b2 || 0,
      icon: <Award className="w-5 h-5" />,
      image: '/photo/B2.png'
    },
    {
      id: 'oxford_c1',
      name: 'C1',
      description: 'ใช้ภาษาได้อย่างคล่องแคล่ว',
      level: 'Advanced',
      color: 'text-red-600',
      gradient: 'from-red-400 to-red-600',
      wordCount: wordCounts.oxford_c1 || 0,
      icon: <Trophy className="w-5 h-5" />,
      image: '/photo/C1.png'
    },
    {
      id: 'oxford_c2',
      name: 'C2',
      description: 'เชี่ยวชาญระดับเจ้าของภาษา',
      level: 'Proficiency',
      color: 'text-indigo-600',
      gradient: 'from-indigo-400 to-indigo-600',
      wordCount: wordCounts.oxford_c2 || 0,
      icon: <BookOpen className="w-5 h-5" />,
      image: '/photo/C2.png'
    }
  ];

  const toeicCategory = {
    id: 'toeic',
    name: 'TOEIC',
    description: 'เตรียมสอบเพื่อการทำงาน',
    level: 'Business English',
    color: 'text-slate-700',
    gradient: 'from-slate-600 to-slate-800',
    wordCount: wordCounts.toeic || 0,
    icon: <Users className="w-5 h-5" />,
    image: '/photo/TOEIC.png'
  };

  useEffect(() => {
    const loadWordCounts = async () => {
      setIsLoading(true);
      const counts: { [key: string]: number } = {};
      
      const categoryIds = ['oxford_a1', 'oxford_a2', 'oxford_b1', 'oxford_b2', 'oxford_c1', 'oxford_c2', 'toeic'];
      
      try {
        for (const categoryId of categoryIds) {
          const response = await fetch(`/${categoryId}.csv`);
          if (response.ok) {
            const text = await response.text();
            const lines = text.split('\n').filter(line => line.trim());
            counts[categoryId] = Math.max(0, lines.length - 1);
          } else {
            counts[categoryId] = 0;
          }
        }
        setWordCounts(counts);
      } catch (error) {
        console.error('Error loading word counts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWordCounts();
  }, []);

  const totalWords = Object.values(wordCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-white via-orange-50 to-white border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
                  Flash Buddy
                </h1>
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              เริ่มเรียนรู้คำศัพท์จาก flashcard อย่างมีประสิทธิภาพ
            </p>
            <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>มาตรฐาน CEFR</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>พร้อมสอบ TOEIC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Category Selection */}
        <div className="space-y-12 sm:space-y-16">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">เลือกระดับของคุณ</h2>
            <p className="text-gray-600 text-sm sm:text-base">เริ่มต้นจากระดับที่เหมาะสมกับความสามารถของคุณ</p>
          </div>

          {/* Oxford Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="group relative bg-white rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Image Container with original aspect ratio */}
                <div className="relative w-full flex-1 min-h-64 sm:min-h-72 lg:min-h-80">
                  <img 
                    src={category.image} 
                    alt={`${category.name} Level`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="text-center mb-3 sm:mb-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-black mb-1">{category.name}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2">{category.description}</p>
                    <span className="text-orange-600 font-medium text-sm sm:text-base">
                      {isLoading ? '...' : `${category.wordCount.toLocaleString()} คำ`}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewVocabulary(category.id);
                      }}
                      className="flex items-center justify-center space-x-2 py-2.5 px-3 sm:px-4 bg-gray-100 hover:bg-gray-200 text-black rounded-lg transition-all duration-300 text-xs sm:text-sm font-medium"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>ดูคำศัพท์</span>
                    </button>
                    
                    <button
                      onClick={() => onCategorySelect(category.id)}
                      className={`flex items-center justify-center space-x-2 py-2.5 px-3 sm:px-4 bg-gradient-to-r ${category.gradient} hover:opacity-90 text-white rounded-lg transition-all duration-300 text-xs sm:text-sm font-medium`}
                    >
                      <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>เริ่มเรียน</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TOEIC Section */}
          <div className="mt-16 sm:mt-20">
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">การสอบมาตรฐาน</h3>
              <p className="text-gray-600 text-sm sm:text-base">เตรียมความพร้อมสำหรับการสอบ TOEIC</p>
            </div>
            
            <div className="max-w-sm mx-auto">
              <div className="group relative bg-white rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                {/* Image Container with original aspect ratio */}
                <div className="relative w-full flex-1 min-h-64 sm:min-h-72 lg:min-h-80">
                  <img 
                    src={toeicCategory.image} 
                    alt="TOEIC Test Preparation"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="text-center mb-3 sm:mb-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-black mb-1">TOEIC</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2">เตรียมสอบเพื่อการทำงาน</p>
                    <span className="text-orange-600 font-medium text-sm sm:text-base">
                      {isLoading ? '...' : `${toeicCategory.wordCount.toLocaleString()} คำ`}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewVocabulary(toeicCategory.id);
                      }}
                      className="flex items-center justify-center space-x-2 py-2.5 px-3 sm:px-4 bg-gray-100 hover:bg-gray-200 text-black rounded-lg transition-all duration-300 text-xs sm:text-sm font-medium"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>ดูคำศัพท์</span>
                    </button>
                    
                    <button
                      onClick={() => onCategorySelect(toeicCategory.id)}
                      className={`flex items-center justify-center space-x-2 py-2.5 px-3 sm:px-4 bg-gradient-to-r ${toeicCategory.gradient} hover:opacity-90 text-white rounded-lg transition-all duration-300 text-xs sm:text-sm font-medium`}
                    >
                      <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>เริ่มเรียน</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Stats */}
        <div className="mt-16 sm:mt-20 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-orange-500" />
              <span>{isLoading ? '...' : totalWords.toLocaleString()} คำศัพท์</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-orange-500" />
              <span>6 ระดับ CEFR</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-orange-500" />
              <span>พร้อมสอบ TOEIC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;