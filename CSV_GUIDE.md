# CSV Data Guide for Oxford Flash Buddy

This guide explains how to add new vocabulary data to the Oxford Flash Buddy application using CSV files.

## Available Categories

The application now supports the following vocabulary categories:

### Oxford Word Lists (by CEFR levels)
- **A1 (Beginner)**: `oxford_a1.csv` - Basic everyday vocabulary
- **A2 (Elementary)**: `oxford_a2.csv` - Elementary level vocabulary  
- **B1 (Intermediate)**: `oxford_b1.csv` - Intermediate level vocabulary
- **B2 (Upper-Intermediate)**: `oxford_b2.csv` - Upper-intermediate level vocabulary

### Other Categories
- **TOEIC**: `toeic.csv` - Business and workplace vocabulary

## รูปแบบข้อมูลใน CSV

```csv
word,pronunciation,meaning,partOfSpeech,example
hello,həˈloʊ,สวัสดี,interjection,Hello! How are you?
```

### คำอธิบายแต่ละคอลัมน์:

1. **word** - คำศัพท์ภาษาอังกฤษ
2. **pronunciation** - การออกเสียง (IPA)
3. **meaning** - ความหมายภาษาไทย (ใส่ quotes หากมี comma)
4. **partOfSpeech** - ชนิดของคำ (noun, verb, adjective, etc.)
5. **example** - ประโยคตัวอย่าง (ใส่ quotes หากมี comma)

## วิธีการเพิ่มข้อมูลใหม่

### 1. เพิ่มข้อมูลผ่าน Excel หรือ Google Sheets
- เปิดไฟล์ CSV ด้วย Excel หรือ Google Sheets
- เพิ่มแถวใหม่ตามรูปแบบที่กำหนด
- บันทึกเป็นไฟล์ CSV

### 2. เพิ่มข้อมูลผ่าน Text Editor
- เปิดไฟล์ CSV ด้วย Text Editor
- เพิ่มบรรทัดใหม่ตามรูปแบบ:
```
คำศัพท์,การออกเสียง,"ความหมาย",ชนิดของคำ,"ประโยคตัวอย่าง"
```

## ข้อควรระวัง

1. **Comma ในข้อมูล**: หากข้อมูลมี comma ให้ใส่ quotes รอบข้อความ
   ```csv
   word,pronunciation,"ความหมาย, คำแปล",partOfSpeech,"ประโยคตัวอย่าง, ตัวอย่าง"
   ```

2. **Quotes ในข้อมูล**: หากต้องการใส่ quotes ในข้อมูล ให้ใช้ double quotes
   ```csv
   word,pronunciation,ความหมาย,partOfSpeech,"He said ""Hello"" to me"
   ```

3. **การเข้าบรรทัดใหม่**: หลีกเลี่ยงการเข้าบรรทัดใหม่ในข้อมูล

## ตัวอย่างการเพิ่มข้อมูล

```csv
word,pronunciation,meaning,partOfSpeech,example
study,ˈstʌdi,"เรียน, ศึกษา",verb,I study English every day.
book,bʊk,"หนังสือ, จอง",noun/verb,I read a book yesterday.
beautiful,ˈbjuːtɪfəl,"สวยงาม, งดงาม",adjective,She has a beautiful smile.
```

## การทดสอบ

หลังจากเพิ่มข้อมูลแล้ว:
1. รีเฟรชหน้าเว็บ
2. ตรวจสอบว่าข้อมูลใหม่แสดงขึ้นในแอป
3. ทดสอบการทำงานของ flashcard

## การสำรองข้อมูล

แนะนำให้สำรองไฟล์ CSV ก่อนแก้ไขเพื่อป้องกันการสูญหายของข้อมูล