import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, ChevronLeft, Save, CheckCircle } from 'lucide-react';
import axios from 'axios';

// Types
interface User {
  masp: string;
  name: string;
}

interface Subject {
  name: string;
  questionCount: number;
  startQ: number;
}

// Components
import Login from './components/Login';
import YearSelect from './components/YearSelect';
import SubjectSelect from './components/SubjectSelect';
import AnswerKey from './components/AnswerKey';
import AdminView from './components/AdminView';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(false);

  // Load user from localStorage if available
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    setUser(user);
    // Only save to local storage if not admin to avoid persistent admin session
    if (user.masp !== 'ADMIN') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedYear(null);
    setSelectedSubject(null);
    localStorage.removeItem('user');
  };

  if (user?.masp === 'ADMIN') {
    return <AdminView onBack={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <AnimatePresence mode="wait">
        {!user ? (
          <Login key="login" onLogin={handleLogin} />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-4">
                {selectedSubject ? (
                  <button 
                    onClick={() => setSelectedSubject(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                ) : selectedYear ? (
                  <button 
                    onClick={() => setSelectedYear(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                ) : null}
                
                <div>
                  <h1 className="text-lg font-semibold text-slate-800">
                    {selectedSubject ? selectedSubject.name : selectedYear ? selectedYear : 'Painel do Professor'}
                  </h1>
                  <p className="text-sm text-slate-500">
                    Olá, {user.name}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
              {!selectedYear ? (
                <YearSelect onSelect={setSelectedYear} />
              ) : !selectedSubject ? (
                <SubjectSelect year={selectedYear} onSelect={setSelectedSubject} />
              ) : (
                <AnswerKey 
                  user={user}
                  year={selectedYear}
                  subject={selectedSubject}
                  onBack={() => setSelectedSubject(null)}
                />
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
