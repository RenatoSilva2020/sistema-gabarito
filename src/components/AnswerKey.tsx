import { useState } from 'react';
import { motion } from 'motion/react';
import { Save, CheckCircle, AlertTriangle } from 'lucide-react';

interface Subject {
  name: string;
  questionCount: number;
  startQ: number;
}

interface AnswerKeyProps {
  user: any;
  year: string;
  subject: Subject;
  onBack: () => void;
}

export default function AnswerKey({ user, year, subject, onBack }: AnswerKeyProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const questions = Array.from({ length: subject.questionCount }, (_, i) => subject.startQ + i);

  const handleSelect = (qNo: number, option: string) => {
    setAnswers(prev => ({ ...prev, [qNo]: option }));
  };

  const handleSubmit = async () => {
    // Validate all questions answered
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < subject.questionCount) {
      setError(`Você respondeu ${answeredCount} de ${subject.questionCount} questões.`);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Save to LocalStorage
      const submission = {
        id: Date.now(),
        masp: user.masp,
        teacher_name: user.name,
        year,
        subject: subject.name,
        answers: JSON.stringify(answers),
        timestamp: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem('submissions') || '[]');
      existing.push(submission);
      localStorage.setItem('submissions', JSON.stringify(existing));

      setSuccess(true);
    } catch (err) {
      setError('Erro ao salvar localmente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-green-100 p-6 rounded-full"
        >
          <CheckCircle className="w-16 h-16 text-green-600" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gabarito Enviado!</h2>
          <p className="text-slate-500 mt-2">Suas respostas foram registradas com sucesso.</p>
        </div>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-20 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{subject.name}</h2>
            <p className="text-sm text-slate-500">
              Questões {subject.startQ} a {subject.startQ + subject.questionCount - 1}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-indigo-600">
              {Object.keys(answers).length} / {subject.questionCount}
            </div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Respondidas</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${(Object.keys(answers).length / subject.questionCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((qNo) => (
          <motion.div
            key={qNo}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border transition-all ${
              answers[qNo] 
                ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono font-bold text-slate-500">Q{qNo}</span>
              {answers[qNo] && (
                <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                  {answers[qNo]}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {['A', 'B', 'C', 'D'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(qNo, opt)}
                  className={`h-10 rounded-lg font-bold text-sm transition-all ${
                    answers[qNo] === opt
                      ? 'bg-indigo-600 text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-lg-up z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm flex-1">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          
          <div className="flex gap-4 ml-auto">
            <button
              onClick={onBack}
              className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Gabarito
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
