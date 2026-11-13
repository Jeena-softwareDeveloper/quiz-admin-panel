import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  educationLevels: { label: string; value: string }[];
  difficulties: string[];
  onSubmit: (data: any) => Promise<void>;
}

/**
 * Modal dialog for creating a bilingual question
 */
export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  onClose,
  categories,
  educationLevels,
  difficulties,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    category: categories[0] || 'TNPSC',
    subCategory: 'General',
    difficulty: difficulties[1] || 'MEDIUM',
    targetEducation: 'ALL',
    questionText: '',
    questionTextTamil: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Bilingual Question"
      subtitle="Add question in English and Tamil with speed-scoring metadata"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={categories}
          />

          <Select
            label="Target Education Level"
            value={formData.targetEducation}
            onChange={(e) => setFormData({ ...formData, targetEducation: e.target.value })}
            options={[
              { label: 'ALL Levels', value: 'ALL' },
              ...educationLevels,
            ]}
          />
        </div>

        <Input
          label="Question Text (English)"
          required
          value={formData.questionText}
          onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
          placeholder="e.g. Who was the Chola king who built the Thanjavur temple?"
        />

        <Input
          label="Question Text (Tamil Translation)"
          value={formData.questionTextTamil}
          onChange={(e) => setFormData({ ...formData, questionTextTamil: e.target.value })}
          placeholder="e.g. தஞ்சை பெரிய கோயிலை கட்டிய சோழ மன்னர் யார்?"
        />

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            4 Options (Select radio for Correct Answer)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {formData.options.map((opt, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus-within:border-emerald-600 focus-within:bg-white transition"
              >
                <input
                  type="radio"
                  name="correctOpt"
                  checked={formData.correctIndex === idx}
                  onChange={() => setFormData({ ...formData, correctIndex: idx })}
                  className="accent-emerald-600 w-4 h-4 cursor-pointer"
                />
                <input
                  type="text"
                  required
                  value={opt}
                  onChange={(e) => {
                    const updated = [...formData.options];
                    updated[idx] = e.target.value;
                    setFormData({ ...formData, options: updated });
                  }}
                  placeholder={`Option ${idx + 1}`}
                  className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Difficulty"
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            options={difficulties}
          />

          <Input
            label="Sub-Category / Topic"
            value={formData.subCategory}
            onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
            placeholder="e.g. History, Kollywood, Physics"
          />
        </div>

        <Input
          label="Answer Explanation"
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          placeholder="Why this answer is correct..."
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            Save Question
          </Button>
        </div>
      </form>
    </Modal>
  );
};

