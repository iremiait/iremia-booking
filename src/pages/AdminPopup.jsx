import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Mail, Eye, EyeOff, Loader } from 'lucide-react';
import PopupDashboard from '../components/admin/PopupDashboard';
import { authService } from '../lib/supabase';

const AdminPopup = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authService.getSession();
        setIsAuthenticated(!!session);
      } catch (err) {
        console.error('Errore controllo sessione:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = authService.onAuthStateChange((session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await authService.login(email, password);
    } catch (err) {
      console.error('Errore login:', err);
      if (err.message === 'Invalid login credentials') {
        setError('Email o password errati.');
      } else if (err.message === 'Email not confirmed') {
        setError('Email non confermata.');
      } else {
        setError('Errore durante il login. Riprova.');
      }
      setPassword('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Errore logout:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size={40} className="animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-teal-100">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
              <Lock size={32} className="text-teal-600" />
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-2">
              Admin Dashboard
            </h2>
            <p className="text-gray-600 text-sm">
              Accesso riservato
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  placeholder="iremiait@gmail.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <span>&#9888;</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  <span>Accesso in corso...</span>
                </>
              ) : (
                <>
                  <Lock size={18} />
                  <span>Accedi</span>
                </>
              )}
            </button>

          </form>

          <div className="mt-6 text-center">
            
              href="/"
              className="text-sm text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 transition"
            >
              <ArrowLeft size={16} />
              <span>Torna alla homepage</span>
            </a>
          </div>

        </div>
      </div>
    );
  }

  return <PopupDashboard onLogout={handleLogout} />;
};

export default AdminPopup;
