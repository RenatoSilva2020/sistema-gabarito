import React, { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { User, Lock } from 'lucide-react';
import { sheetService } from '../services/sheetService';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [masp, setMasp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const users = await sheetService.getUsers();
      const user = users.find((u: any) => u.masp === masp);
      
      if (user) {
        onLogin(user);
      } else {
        setError('MASP não encontrado.');
      }
    } catch (err) {
      setError('Erro ao conectar com a planilha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200"
      >
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Acesso Restrito</h1>
          <p className="text-slate-500 mt-2">Digite seu MASP para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="masp" className="block text-sm font-medium text-slate-700 mb-1">
              MASP
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="masp"
                type="text"
                required
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                placeholder="123456"
                value={masp}
                onChange={(e) => setMasp(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              const pwd = prompt('Senha de Administrador:');
              if (pwd === 'admin123') { // Simple hardcoded password for demo
                onLogin({ masp: 'ADMIN', name: 'Administrador' });
              } else if (pwd) {
                alert('Senha incorreta');
              }
            }}
            className="text-xs text-slate-400 hover:text-indigo-500 transition-colors"
          >
            Acesso Administrativo
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
