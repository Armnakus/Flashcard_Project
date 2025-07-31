
import React, { useState } from 'react';
import CategorySelector from './CategorySelector';
import FlashcardPage from './FlashcardPage';
import VocabularyList from './VocabularyList';

type ViewMode = 'category' | 'flashcard' | 'vocabulary';

const FlashcardApp: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('category');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setViewMode('flashcard');
  };

  const handleViewVocabulary = (category: string) => {
    setSelectedCategory(category);
    setViewMode('vocabulary');
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setViewMode('category');
  };

  const handleStartFlashcards = () => {
    setViewMode('flashcard');
  };

  if (selectedCategory && viewMode === 'flashcard') {
    return <FlashcardPage category={selectedCategory} onBack={handleBack} />;
  }

  if (selectedCategory && viewMode === 'vocabulary') {
    return (
      <VocabularyList 
        category={selectedCategory} 
        onBack={handleBack}
        onStartFlashcards={handleStartFlashcards}
      />
    );
  }

  return (
    <CategorySelector 
      onCategorySelect={handleCategorySelect}
      onViewVocabulary={handleViewVocabulary}
    />
  );
};

export default FlashcardApp;
