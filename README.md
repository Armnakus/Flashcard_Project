# Oxford Flash Buddy

แอปพลิเคชันสำหรับเรียนรู้คำศัพท์ภาษาอังกฤษจาก Oxford 3000 และ TOEIC

## ✨ Features

- 📚 **Flashcard Mode**: เรียนรู้คำศัพท์แบบ flashcard
- 🎯 **Quiz Mode**: ทดสอบความรู้ด้วยระบบ quiz
- 📊 **Progress Tracking**: ติดตามความคืบหน้าในการเรียน
- 📱 **Responsive Design**: ใช้งานได้ทั้งบนมือถือและคอมพิวเตอร์
- 🎨 **Modern UI**: ออกแบบด้วย Tailwind CSS และ shadcn/ui

## 🚀 Live Demo

เข้าชมเว็บไซต์ได้ที่: [https://Armnakus.github.io/Flashcard_Project](https://Armnakus.github.io/Flashcard_Project)

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## 📦 Installation

1. Clone repository:
```bash
git clone https://github.com/Armnakus/Flashcard_Project.git
cd Flashcard_Project
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser

## 🚀 Deployment

### Manual Deployment
```bash
npm run deploy
```

### Auto Deployment
โปรเจกต์นี้ใช้ GitHub Actions สำหรับ auto deployment เมื่อมีการ push ไปยัง main branch

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── CategorySelector.tsx
│   ├── FlashcardApp.tsx
│   ├── FlashcardPage.tsx
│   └── VocabularyList.tsx
├── data/               # CSV data files
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── pages/              # Page components
```

## 📊 Data Sources

- **Oxford 3000**: คำศัพท์พื้นฐานจาก Oxford
- **TOEIC**: คำศัพท์สำหรับสอบ TOEIC
- **CEFR Levels**: A1, A2, B1, B2, C1, C2

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Armnakus**
- GitHub: [@Armnakus](https://github.com/Armnakus)

---

Made with ❤️ for English learners