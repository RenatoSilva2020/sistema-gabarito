import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';
import { sheetService } from '../services/sheetService';

interface YearSelectProps {
  onSelect: (year: string) => void;
}

export default function YearSelect({ onSelect }: YearSelectProps) {
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load years from service (synchronous in this case, but good practice to wrap)
    const data = sheetService.getYears();
    setYears(data);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8 bg-red-50 rounded-xl">
        {error}
      </div>
    );
  }

  // Group years by Unit and Category
  const units = {
    'Sede': {
      'Ensino Fundamental': years.filter(y => y.includes('ANO')),
      'Ensino Médio - Diurno': years.filter(y => y.includes('DIURNO')),
      'Ensino Médio - Noturno': years.filter(y => y.includes('NOT-S')),
      'EJA': years.filter(y => y.includes('EJA-S')),
    },
    'Morada Nova': {
      'Ensino Médio - Noturno': years.filter(y => y.includes('NOT-M')),
      'EJA': years.filter(y => y.includes('EJA-M')),
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Selecione a Turma</h2>
        <p className="text-slate-500 mt-2">Escolha a unidade e a turma para registrar o gabarito</p>
      </div>

      {Object.entries(units).map(([unitName, categories]) => (
        <div key={unitName} className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
            Unidade {unitName}
          </h2>
          
          <div className="space-y-8">
            {Object.entries(categories).map(([category, categoryYears]) => (
              categoryYears.length > 0 && (
                <div key={category} className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-600 border-b border-slate-200 pb-2 ml-2">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryYears.map((year, index) => (
                      <motion.button
                        key={year}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSelect(year)}
                        className="group relative bg-white p-4 rounded-xl shadow-sm hover:shadow-md border border-slate-200 hover:border-indigo-300 transition-all text-left flex items-center gap-3"
                      >
                        <div className={`p-2 rounded-lg transition-colors ${
                          unitName === 'Morada Nova' ? 'bg-orange-50 group-hover:bg-orange-100' : 'bg-indigo-50 group-hover:bg-indigo-100'
                        }`}>
                          <Calendar className={`w-5 h-5 ${
                            unitName === 'Morada Nova' ? 'text-orange-600' : 'text-indigo-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                            {year}
                          </h3>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
