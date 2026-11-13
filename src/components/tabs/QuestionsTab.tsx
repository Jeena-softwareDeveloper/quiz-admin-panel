import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Plus, Search, Upload, Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { QuestionItem } from '../../types';

interface QuestionsTabProps {
  questions: QuestionItem[];
  categories: string[];
  onAddQuestion: () => void;
  onOpenBulkUpload: () => void;
}

/**
 * Question Bank Management Tab
 * Includes Template Download & Excel/CSV Bulk Upload
 */
export const QuestionsTab: React.FC<QuestionsTabProps> = ({
  questions,
  categories,
  onAddQuestion,
  onOpenBulkUpload,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        category: 'TNPSC',
        subCategory: 'Tamil Literature',
        difficulty: 'EASY',
        targetEducation: 'ALL',
        questionText: 'Who authored the Tamil epic Tirukkural?',
        questionTextTamil: 'திருக்குறளை இயற்றியவர் யார்?',
        optionA: 'Thiruvalluvar',
        optionB: 'Avvaiyar',
        optionC: 'Kambar',
        optionD: 'Bharathiyar',
        correctOption: 'A',
        explanation: 'Thiruvalluvar composed Tirukkural containing 1330 couplets.',
      },
      {
        category: 'CINEMA',
        subCategory: 'Kollywood',
        difficulty: 'MEDIUM',
        targetEducation: 'ALL',
        questionText: 'Which music composer won Oscar for Slumdog Millionaire?',
        questionTextTamil: 'ஸ்லம்டாக் மில்லியனர் படத்திற்காக ஆஸ்கார் விருது வென்ற தமிழ் இசையமைப்பாளர் யார்?',
        optionA: 'Ilaiyaraaja',
        optionB: 'A. R. Rahman',
        optionC: 'Anirudh',
        optionD: 'Harris Jayaraj',
        correctOption: 'B',
        explanation: 'A.R. Rahman won two Academy Awards in 2009 for Slumdog Millionaire.',
      },
      {
        category: 'GENERAL_GK',
        subCategory: 'Geography',
        difficulty: 'EASY',
        targetEducation: 'SCHOOL',
        questionText: 'What is the capital city of Tamil Nadu?',
        questionTextTamil: 'தமிழ்நாட்டின் தலைநகரம் எது?',
        optionA: 'Madurai',
        optionB: 'Coimbatore',
        optionC: 'Chennai',
        optionD: 'Tiruchirappalli',
        correctOption: 'C',
        explanation: 'Chennai (formerly Madras) is the state capital of Tamil Nadu.',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');
    XLSX.writeFile(workbook, 'quiz_questions_template.xlsx');
  };

  // Dynamically filter questions
  const filtered = questions.filter((q) => {
    const matchesCategory = selectedCategory === 'ALL' || q.category === selectedCategory;
    const matchesSearch =
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.questionTextTamil && q.questionTextTamil.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Dynamic Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {['ALL', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition duration-150 border ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {/* Download Template Button */}
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5 text-emerald-600" />}
            onClick={handleDownloadTemplate}
            className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
          >
            Template (.xlsx)
          </Button>

          {/* Bulk Upload Button */}
          <Button
            variant="secondary"
            size="sm"
            icon={<Upload className="w-3.5 h-3.5 text-emerald-700" />}
            onClick={onOpenBulkUpload}
            className="bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
          >
            Excel Upload
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={onAddQuestion}
          >
            Add Question
          </Button>
        </div>
      </div>

      {/* Questions Data Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="p-4">Category</th>
                <th className="p-4">Question (English & Tamil)</th>
                <th className="p-4">Options & Correct Answer</th>
                <th className="p-4">Target Level</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Usage & Rotation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                    No questions match the selected category or search filter.
                  </td>
                </tr>
              ) : (
                filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/60 transition duration-150">
                    <td className="p-4 align-top">
                      <Badge variant="emerald">{q.category}</Badge>
                      {q.subCategory && <div className="text-xs text-slate-500 mt-1">{q.subCategory}</div>}
                    </td>
                    <td className="p-4 align-top max-w-md">
                      <div className="font-medium text-slate-900">{q.questionText}</div>
                      {q.questionTextTamil && (
                        <div className="text-xs text-emerald-800 mt-1 font-normal leading-relaxed">
                          {q.questionTextTamil}
                        </div>
                      )}
                      {q.explanation && (
                        <div className="text-[11px] text-slate-500 mt-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          Explanation: {q.explanation}
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-top">
                      <div className="grid grid-cols-2 gap-1.5 w-64">
                        {q.options.map((opt, idx) => {
                          const isCorrect = idx === q.correctIndex;
                          return (
                            <div
                              key={idx}
                              className={`text-xs px-2.5 py-1.5 rounded-lg border transition ${
                                isCorrect
                                  ? 'bg-emerald-600 text-white font-medium border-emerald-600 shadow-sm'
                                  : 'bg-slate-50 text-slate-600 border-slate-200/60'
                              }`}
                            >
                              <span className="font-bold mr-1">{String.fromCharCode(65 + idx)}.</span>
                              {opt}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {q.targetEducation}
                      </span>
                    </td>
                    <td className="p-4 align-top">
                      <span
                        className={`text-xs font-bold ${
                          q.difficulty === 'EASY'
                            ? 'text-emerald-700'
                            : q.difficulty === 'MEDIUM'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="p-4 align-top">
                      {(q.timesUsed || 0) === 0 ? (
                        <span className="inline-flex items-center text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                          Fresh (0 Rooms)
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Featured in {q.timesUsed} {q.timesUsed === 1 ? 'room' : 'rooms'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
