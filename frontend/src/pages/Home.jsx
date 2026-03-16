import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useSocket from '../hooks/useSocket.js';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Stats from '../components/Stats';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [recs, setRecs] = useState([]);
  const [dash, setDash] = useState({ categories: [], upcomingByMonth: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const categories = ['All','Tech','Sports','Cultural','Workshop'];
  const { announcements } = useSocket(window.location.origin);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (user) fetchRecs();
    else setRecs([]);
  }, [user]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function fetchEvents(overrides = {}) {
    setLoading(true);
    setError('');
    try {
      const effQ = overrides.q !== undefined ? overrides.q : q;
      const effCategory = overrides.category !== undefined ? overrides.category : category;
      const params = {};
      if (effQ) params.q = effQ;
      if (effCategory) params.category = effCategory;
      const res = await axios.get('/api/events', { params });
      setEvents(res.data.events || []);
    } catch (e) {
      setError('Failed to load events. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchRecs() {
    try {
      const res = await axios.get('/api/stats/recommendations');
      setRecs(res.data.events || []);
    } catch (_) {}
  }

  async function fetchDashboard() {
    try {
      const r = await axios.get('/api/stats/dashboard');
      setDash({
        categories: r.data?.categories || [],
        upcomingByMonth: r.data?.upcomingByMonth || [],
      });
    } catch (_) {}
  }

  const Badge = ({ status }) => (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${status==='approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : status==='pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>{status}</span>
  );

  const Card = ({ e, index }) => (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onHoverStart={() => setSelectedEvent(e._id)}
      onHoverEnd={() => setSelectedEvent(null)}
    >
      <Link 
        to={`/events/${e._id}`} 
        className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden transition-all duration-300
          hover:shadow-[0_0_30px_-5px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)]
          border border-slate-200/60 dark:border-slate-800/60 hover:border-indigo-500/50 dark:hover:border-indigo-500/50
          block h-full"
      >
        <div className="aspect-[16/9] relative overflow-hidden">
          <img
            src={e.posterUrl || '/placeholder.svg'}
            alt={e.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out
              group-hover:scale-110"
            onError={(ev)=>{ ev.currentTarget.onerror=null; ev.currentTarget.src='/placeholder.svg'; }}
            loading="lazy"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: selectedEvent === e._id ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" 
          />
          <motion.div 
            initial={{ translateY: 20, opacity: 0 }}
            animate={{ 
              translateY: selectedEvent === e._id ? 0 : 20,
              opacity: selectedEvent === e._id ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 p-4"
          >
            <p className="text-white/90 text-sm line-clamp-2">{e.description}</p>
          </motion.div>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Badge status={e.status} />
            <motion.span 
              animate={{ scale: selectedEvent === e._id ? 1.05 : 1 }}
              className="text-xs px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 
              text-indigo-600 dark:text-indigo-400 font-medium"
            >
              {e.category}
            </motion.span>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-2 text-slate-800 dark:text-slate-100 
              group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
              {e.title}
            </h3>
            
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(e.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{e.location}</span>
              </div>
            </div>
          </div>

          <motion.div 
            animate={{ scaleX: selectedEvent === e._id ? 1 : 0 }}
            className="flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800"
          >
            {[...Array(5)].map((_, i) => (
              <motion.svg 
                key={i}
                animate={{ scale: selectedEvent === e._id ? 1.1 : 1 }}
                transition={{ delay: i * 0.05 }}
                className={`w-4 h-4 ${i < Math.round(e.averageRating || 0) ? 
                  'text-amber-400 dark:text-amber-500' : 'text-slate-300 dark:text-slate-700'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </motion.svg>
            ))}
            <motion.span 
              animate={{ opacity: selectedEvent === e._id ? 1 : 0.5 }}
              className="ml-2 text-sm text-slate-600 dark:text-slate-400">
              {e.averageRating?.toFixed?.(1) || '0.0'}
            </motion.span>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );

  const Skeleton = () => (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 overflow-hidden">
      <div className="relative">
        <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-xl loading-shimmer" />
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className="w-16 h-6 bg-white/90 dark:bg-slate-800/90 rounded-full loading-shimmer" />
          <div className="w-20 h-6 bg-white/90 dark:bg-slate-800/90 rounded-full loading-shimmer" />
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 w-3/4 rounded-lg loading-shimmer" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 w-full rounded loading-shimmer" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 w-2/3 rounded loading-shimmer" />
        </div>
        <div className="flex justify-between pt-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 w-24 rounded loading-shimmer" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 w-24 rounded loading-shimmer" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl p-3 bg-rose-50 border border-rose-200 text-rose-700">{error}</div>
      )}
      {announcements.length > 0 && (
        <div className="rounded-xl p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
          <div className="font-semibold mb-1">Live announcements</div>
          <ul className="text-sm text-emerald-800 dark:text-emerald-200 list-disc pl-5 space-y-1">
            {announcements.slice(0,3).map((a, i) => (
              <li key={i}>{a.message}</li>
            ))}
          </ul>
        </div>
      )}

      <section className="py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-8 shadow-lg"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-4"
          >
            <motion.div 
              className="relative flex-1"
              whileFocus={{ scale: 1.02 }}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <motion.input 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 
                  bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                  focus:border-transparent transition-all duration-200" 
                placeholder="Search events..." 
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchEvents()}
              />
            </motion.div>
            <div className="flex flex-wrap gap-2 items-center justify-end">
              {categories.map((c, idx) => {
                const active = (c==='All' && !category) || c===category;
                return (
                  <motion.button
                    key={c}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    onClick={()=>{
                      const next = c==='All' ? '' : c;
                      setCategory(next);
                      fetchEvents({ category: next });
                    }}
                  >
                    {c}
                  </motion.button>
                );
              })}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium 
                  hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200" 
                onClick={fetchEvents}
              >
                Search
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            All events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? 
              Array.from({length:6}).map((_,i)=>(
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Skeleton />
                </motion.div>
              )) : 
              events.length > 0 ? events.map((e, index) => (
                <motion.div
                  key={e._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card e={e} index={index} />
                </motion.div>
              )) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-600 dark:text-slate-400 text-lg">No events found. Try adjusting your filters.</p>
                </div>
              )
            }
          </div>
        </motion.div>
      </section>

      {recs.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-4 py-16"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Recommended for you
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recs.map((e, index) => (
              <motion.div
                key={e._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card e={e} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      <Features />

      <Stats />
        
      <Testimonials />
        
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 text-center"
        >
          <Link 
            to="/signup" 
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 
              text-white font-medium text-lg shadow-xl shadow-indigo-500/25 
              transition-all duration-200 transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/40"
          >
            Get Started Today
          </Link>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Join us to start managing and participating in events
          </p>
        </motion.div>
      )}

      {/* Event Statistics Dashboard */}
      {(dash.categories.length > 0 || dash.upcomingByMonth.length > 0) && (
        <section className="mt-16 animate-fade-in">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Event Statistics
          </h2>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 
            backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-indigo-600 dark:text-indigo-400">By Category</h3>
                <ul className="space-y-2">
                  {dash.categories.map((c) => (
                    <li key={c._id} className="transform transition-all duration-200 hover:scale-102">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 
                        border border-slate-200 dark:border-slate-700 group hover:border-indigo-500 
                        dark:hover:border-indigo-400 transition-all duration-200">
                        <span className="font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {c._id || 'Uncategorized'}
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 text-indigo-600 
                          dark:text-indigo-400 font-semibold">{c.count}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-indigo-600 dark:text-indigo-400">Upcoming Events</h3>
                <ul className="space-y-2">
                  {dash.upcomingByMonth.map((m) => (
                    <li key={m._id} className="transform transition-all duration-200 hover:scale-102">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 
                        border border-slate-200 dark:border-slate-700 group hover:border-indigo-500 
                        dark:hover:border-indigo-400 transition-all duration-200">
                        <span className="font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {m._id}
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 text-indigo-600 
                          dark:text-indigo-400 font-semibold">{m.count}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Leaderboard() {
  const [rows, setRows] = useState([]);
  useEffect(() => { (async () => { const r = await axios.get('/api/stats/leaderboard'); setRows(r.data.leaderboard || []); })(); }, []);
  return (
    <ul className="space-y-2">
      {rows.map((r, idx) => (
        <li key={r._id || idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center gap-3"><span className="w-6 text-center font-semibold">{idx+1}</span><span>{r.name}</span></div>
          <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{r.points} pts</span>
        </li>
      ))}
    </ul>
  );
}
