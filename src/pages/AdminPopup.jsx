import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import PopupDashboard from '../components/admin/PopupDashboard';

const AdminPopup = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const ADMIN_PASSWORD = 'iremia2025';

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Password errata!');
      setPassword('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setPassword('');
  };

  // Schermata Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-teal-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
              <Lock size={32} className="text-teal-600" />
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-2">Admin Dashboard</h2>
            <p className="text-gray-600">Inserisci la password per accedere</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Inserisci la password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-medium"
            >
              Accedi
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Torna alla homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard autenticata
  return <PopupDashboard onLogout={handleLogout} />;
};

export default AdminPopup;
