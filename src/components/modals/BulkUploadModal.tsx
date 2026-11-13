import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { api } from '../../api';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ParsedRow {
  rowNum: number;
  category: string;
  subCategory?: string;
  difficulty: string;
  targetEducation: string;
  questionText: string;
  questionTextTamil?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation?: string;
  isValid: boolean;
  validationError?: string;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    // Generate template client-side using XLSX
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (!rawJson || rawJson.length === 0) {
          setErrorMsg('The selected spreadsheet has no data rows.');
          return;
        }

        const formattedRows: ParsedRow[] = rawJson.map((r, idx) => {
          const rowNum = idx + 1;
          const category = String(r.category || r.Category || '').trim();
          const questionText = String(r.questionText || r['Question Text'] || r.question || '').trim();
          const optionA = String(r.optionA || r['Option A'] || r.A || '').trim();
          const optionB = String(r.optionB || r['Option B'] || r.B || '').trim();
          const optionC = String(r.optionC || r['Option C'] || r.C || '').trim();
          const optionD = String(r.optionD || r['Option D'] || r.D || '').trim();
          const correctOption = String(r.correctOption || r['Correct Option'] || r.answer || 'A').trim().toUpperCase();

          let isValid = true;
          let validationError = '';

          if (!category) {
            isValid = false;
            validationError = 'Missing category';
          } else if (!questionText) {
            isValid = false;
            validationError = 'Missing question text';
          } else if (!optionA || !optionB || !optionC || !optionD) {
            isValid = false;
            validationError = 'Must have all 4 options (A, B, C, D)';
          } else if (!['A', 'B', 'C', 'D', '0', '1', '2', '3'].includes(correctOption)) {
            isValid = false;
            validationError = 'Correct option must be A, B, C, or D';
          }

          return {
            rowNum,
            category,
            subCategory: r.subCategory || r.SubCategory,
            difficulty: r.difficulty || r.Difficulty || 'MEDIUM',
            targetEducation: r.targetEducation || r.TargetEducation || 'ALL',
            questionText,
            questionTextTamil: r.questionTextTamil || r['Question Text (Tamil)'],
            optionA,
            optionB,
            optionC,
            optionD,
            correctOption,
            explanation: r.explanation || r.Explanation,
            isValid,
            validationError,
          };
        });

        setParsedRows(formattedRows);
      } catch (err: any) {
        setErrorMsg('Failed to parse file. Please verify it is a valid Excel or CSV sheet.');
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleUploadSubmit = async () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      setErrorMsg('No valid rows to import.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const payload = validRows.map((r) => ({
        category: r.category,
        subCategory: r.subCategory,
        difficulty: r.difficulty,
        targetEducation: r.targetEducation,
        questionText: r.questionText,
        questionTextTamil: r.questionTextTamil,
        optionA: r.optionA,
        optionB: r.optionB,
        optionC: r.optionC,
        optionD: r.optionD,
        correctOption: r.correctOption,
        explanation: r.explanation,
      }));

      const res = await api.post('/admin/questions/bulk-upload', { questions: payload });
      alert(res.data.message || `Successfully imported ${validRows.length} questions!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to upload questions');
    } finally {
      setLoading(false);
    }
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Upload Question Bank (Excel / CSV)"
      subtitle="Download the pre-formatted template, fill in bilingual questions, and upload"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-5">
        {/* Step 1: Template Download & File Picker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                Step 1: Download Standard Template
              </div>
              <p className="text-xs text-emerald-700 mt-1">
                Contains pre-configured column headers and sample bilingual Tamil/English questions.
              </p>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={handleDownloadTemplate}
                className="bg-white hover:bg-emerald-50 border-emerald-300 text-emerald-800"
              >
                Download Excel (.xlsx) Template
              </Button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <Upload className="w-5 h-5 text-emerald-600" />
                Step 2: Choose Filled Excel or CSV
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Supports .xlsx, .xls, and .csv formats with automatic column validation.
              </p>
            </div>
            <div className="mt-4">
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                variant="primary"
                size="sm"
                icon={<Upload className="w-4 h-4" />}
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? file.name : 'Select Spreadsheet File'}
              </Button>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 2: Spreadsheet Preview Table */}
        {parsedRows.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">Parsed Spreadsheet Preview</h4>
                <Badge variant="emerald">{validCount} Valid Rows</Badge>
                {invalidCount > 0 && <Badge variant="rose">{invalidCount} Errors</Badge>}
              </div>
              <span className="text-xs text-slate-500">Total {parsedRows.length} rows loaded</span>
            </div>

            <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Row</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Question Text</th>
                    <th className="p-2.5">Options</th>
                    <th className="p-2.5">Answer</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedRows.map((r) => (
                    <tr key={r.rowNum} className={r.isValid ? 'hover:bg-slate-50/50' : 'bg-rose-50/40'}>
                      <td className="p-2.5 font-mono text-slate-500">#{r.rowNum}</td>
                      <td className="p-2.5">
                        <Badge variant="emerald">{r.category}</Badge>
                      </td>
                      <td className="p-2.5 max-w-xs truncate text-slate-800 font-medium">
                        {r.questionText}
                        {r.questionTextTamil && (
                          <div className="text-[10px] text-emerald-700 truncate">{r.questionTextTamil}</div>
                        )}
                      </td>
                      <td className="p-2.5 text-slate-600 text-[11px]">
                        A: {r.optionA} • B: {r.optionB}
                      </td>
                      <td className="p-2.5 font-bold text-emerald-800">{r.correctOption}</td>
                      <td className="p-2.5">
                        {r.isValid ? (
                          <span className="flex items-center gap-1 text-emerald-700 text-[11px] font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-600 text-[11px] font-semibold">
                            <AlertCircle className="w-3.5 h-3.5" /> {r.validationError}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUploadSubmit}
            loading={loading}
            disabled={validCount === 0}
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            Confirm & Import {validCount} Questions
          </Button>
        </div>
      </div>
    </Modal>
  );
};

