import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Home from './pages/Home.jsx';
import HomeAdvanced from './pages/HomeAdvanced.jsx';
import Wishlist from './pages/Wishlist.jsx';
import EventDetails from './pages/EventDetails.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Pass from './pages/Pass.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider, useToast } from './context/ToastContext.jsx';
import { useEffect, useState } from 'react';

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function useTheme() {
  const getInitial = () => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const [theme, setTheme] = useState(getInitial);
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') { root.classList.add('dark'); body && body.classList.add('dark'); }
    else { root.classList.remove('dark'); body && body.classList.remove('dark'); }
    localStorage.setItem('theme', theme);
  }, [theme]);
  return { theme, setTheme };
}

function Navbar() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('success', 'Goodbye! You\'ve been logged out');
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-extrabold text-xl md:text-2xl tracking-tight hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">EventManager</span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link 
              to="/" 
              className={`transition-all duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 ${
                location.pathname === '/' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className={`transition-all duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 ${
                location.pathname === '/explore' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''
              }`}
            >
              Explore
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className={`transition-all duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 ${
                  location.pathname.startsWith('/dashboard') ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''
                }`}
              >
                Dashboard
              </Link>
            )}
            {user ? (
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200"
                >
                  Sign up
                </Link>
              </>
            )}
            <button 
              aria-label="Toggle theme" 
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-200"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? 
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
                : 
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              }
            </button>
          </nav>
        </div>

        {/* Mobile navigation */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} pt-4 pb-3 border-t border-gray-200 dark:border-slate-700 mt-3`}>
          <div className="flex flex-col gap-3">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/' ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/explore' ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' : ''
              }`}
            >
              Explore
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname.startsWith('/dashboard') ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' : ''
                }`}
              >
                Dashboard
              </Link>
            )}
            {user ? (
              <button 
                onClick={handleLogout} 
                className="px-3 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-center transition-all duration-200"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col">
      <Navbar />
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-6xl mx-auto px-4 py-16 relative">
          <div className="animate-fade-in text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 max-w-4xl mx-auto">
              Discover and Manage Events
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto animate-slide-up">
              Register, organize, review, and track your event participation with our modern platform.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>
      </section>
      <main className="max-w-6xl mx-auto p-4 flex-1">
        {children}
      </main>
      <footer className="bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-white font-bold text-xl">EventManager</h3>
              <p className="text-indigo-100">
                Creating unforgettable experiences and bringing people together through seamless event management.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-indigo-100 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="text-indigo-100 hover:text-white transition-colors">
                    Events
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-indigo-100 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Categories</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/?category=Tech" className="text-indigo-100 hover:text-white transition-colors">
                    Tech Events
                  </Link>
                </li>
                <li>
                  <Link to="/?category=Cultural" className="text-indigo-100 hover:text-white transition-colors">
                    Cultural Events
                  </Link>
                </li>
                <li>
                  <Link to="/?category=Sports" className="text-indigo-100 hover:text-white transition-colors">
                    Sports Events
                  </Link>
                </li>
                <li>
                  <Link to="/?category=Workshop" className="text-indigo-100 hover:text-white transition-colors">
                    Workshops
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Contact</h4>
              <div className="space-y-2">
                <p className="text-indigo-100 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@eventmanager.com
                </p>
                <p className="text-indigo-100 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-indigo-400/30"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-indigo-100 text-sm">
                © 2025 EventManager. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-indigo-100 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-indigo-100 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-indigo-100 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              <p className="text-indigo-100 text-sm">
                Developed by <span className="font-semibold text-white">Silent Four</span>
              </p>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<HomeAdvanced />} />
              <Route path="/wishlist" element={<PrivateRoute roles={["customer","organizer","admin"]}><Wishlist /></PrivateRoute>} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pass" element={<PrivateRoute roles={["customer","organizer","admin"]}><Pass /></PrivateRoute>} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute roles={["customer", "organizer", "admin"]}>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
