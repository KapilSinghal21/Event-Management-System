import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './tailwind.css'
import axios from 'axios'

axios.defaults.baseURL = '' // same origin proxy

// Ensure theme is applied immediately on app bootstrap
function applyThemeFromStorage() {
  try {
    const root = document.documentElement;
    const body = document.body;
    const storedTheme = localStorage.getItem('theme');
    // If no theme is stored, check system preference
    if (!storedTheme) {
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      root.classList.add('dark');
      body && body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body && body.classList.remove('dark');
    }
    // expose for debugging
    window.theme = {
      get: () => localStorage.getItem('theme'),
      set: (next) => { localStorage.setItem('theme', next); applyThemeFromStorage(); }
    };
  } catch (_) {}
}

applyThemeFromStorage();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
