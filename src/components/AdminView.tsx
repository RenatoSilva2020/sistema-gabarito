import { useState, useEffect } from 'react';
import { Download, ChevronLeft, Trash2 } from 'lucide-react';
import Papa from 'papaparse';

interface Submission {
  id: number;
  masp: string;
  teacher_name: string;
  year: string;
  subject: string;
  answers: string; // JSON
  timestamp: string;
}

interface AdminViewProps {
  onBack: () => void;
}

export default function AdminView({ onBack }: AdminViewProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from LocalStorage
    const loadData = () => {
      const data = JSON.parse(localStorage.getItem('submissions') || '[]');
      // Sort by timestamp desc
      data.sort((a: Submission, b: Submission) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setSubmissions(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleDownload = () => {
    const csv = Papa.unparse(submissions.map(s => ({
      ...s,
      answers: s.answers 
    })));
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gabaritos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleClear = () => {
    if (confirm('Tem certeza que deseja apagar todos os registros locais?')) {
      localStorage.removeItem('submissions');
      setSubmissions([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">Administração (Local)</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Limpar
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Professor</th>
                    <th className="px-6 py-4">MASP</th>
                    <th className="px-6 py-4">Ano</th>
                    <th className="px-6 py-4">Disciplina</th>
                    <th className="px-6 py-4">Respostas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(sub.timestamp).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">{sub.teacher_name}</td>
                      <td className="px-6 py-4 font-mono text-xs">{sub.masp}</td>
                      <td className="px-6 py-4">{sub.year}</td>
                      <td className="px-6 py-4">{sub.subject}</td>
                      <td className="px-6 py-4 max-w-xs truncate font-mono text-xs text-slate-400">
                        {sub.answers}
                      </td>
                    </tr>
                  ))}
                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        Nenhum gabarito registrado ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
