import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, AlertCircle } from 'lucide-react';
import { sheetService } from '../services/sheetService';

interface Subject {
  name: string;
  questionCount: number;
  startQ: number;
}

interface SubjectSelectProps {
  year: string;
  onSelect: (subject: Subject) => void;
}

export default function SubjectSelect({ year, onSelect }: SubjectSelectProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await sheetService.getSubjects(year);
        setSubjects(data);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar disciplinas. Verifique se a planilha está acessível.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [year]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-slate-500 animate-pulse">Carregando disciplinas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-xl border border-red-100 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">Erro ao carregar</h3>
        <p className="text-red-600 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <p className="text-slate-500">Nenhuma disciplina encontrada para este ano.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Disciplinas - {year}</h2>
        <p className="text-slate-500 mt-2">Escolha sua matéria para preencher o gabarito</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subject, index) => (
          <motion.button
            key={subject.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(subject)}
            className="group flex items-center justify-between p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="bg-emerald-50 p-3 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                  {subject.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Questões {subject.startQ} a {subject.startQ + subject.questionCount - 1}
                </p>
              </div>
            </div>
            <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              {subject.questionCount} Questões
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
