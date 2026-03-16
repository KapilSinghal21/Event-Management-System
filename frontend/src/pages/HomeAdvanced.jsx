import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchFilters from '../components/SearchFilters.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function HomeAdvanced() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, type: 'info', message: '' });
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: '',
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const showToast = (type, message) => {
    setToast({ open: true, type, message });
    setTimeout(() => setToast({ open: false, type: 'info', message: '' }), 3000);
  };

  useEffect(() => {
    loadWishlist();
    fetchEvents();
  }, []);

  async function loadWishlist() {
    if (!user) return;
    try {
      const res = await axios.get('/api/wishlist');
      const ids = new Set(res.data.wishlist.map(w => w.event._id));
      setWishlistIds(ids);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  }

  async function fetchEvents() {
    setLoading(true);
    try {
      const params = {};
      if (filters.q) params.q = filters.q;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const res = await axios.get('/api/events', { params });
      setEvents(res.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      showToast('error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Fetch events with new filters
    fetchEventsWithFilters(newFilters);
  };

  async function fetchEventsWithFilters(newFilters) {
    setLoading(true);
    try {
      const params = {};
      if (newFilters.q) params.q = newFilters.q;
      if (newFilters.category) params.category = newFilters.category;
      if (newFilters.minPrice) params.minPrice = newFilters.minPrice;
      if (newFilters.maxPrice) params.maxPrice = newFilters.maxPrice;
      if (newFilters.startDate) params.startDate = newFilters.startDate;
      if (newFilters.endDate) params.endDate = newFilters.endDate;

      const res = await axios.get('/api/events', { params });
      setEvents(res.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      showToast('error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }

  async function toggleWishlist(eventId, e) {
    e.preventDefault();
    if (!user) {
      showToast('warning', 'Please login to add to wishlist');
      navigate('/login');
      return;
    }

    try {
      if (wishlistIds.has(eventId)) {
        await axios.delete(`/api/wishlist/${eventId}`);
        setWishlistIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
        showToast('success', 'Removed from wishlist');
      } else {
        await axios.post(`/api/wishlist/${eventId}`);
        setWishlistIds(prev => new Set(prev).add(eventId));
        showToast('success', 'Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      showToast('error', 'Failed to update wishlist');
    }
  }

  function openMap(event, e) {
    e.preventDefault();
    if (event.latitude && event.longitude) {
      const mapsUrl = `https://www.google.com/maps?q=${event.latitude},${event.longitude}`;
      window.open(mapsUrl, '_blank');
    } else {
      showToast('warning', 'Location not available for this event');
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast.open && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${
            toast.type === 'success'
              ? 'bg-green-600'
              : toast.type === 'warning'
              ? 'bg-yellow-600'
              : toast.type === 'error'
              ? 'bg-red-600'
              : 'bg-blue-600'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="font-semibold capitalize">{toast.type}</span>
            <span className="opacity-90">{toast.message}</span>
            <button
              className="ml-4 opacity-80 hover:opacity-100"
              onClick={() => setToast({ ...toast, open: false })}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Discover Events</h1>
        {user && (
          <Link
            to="/wishlist"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all flex items-center gap-2"
          >
            ❤️ My Wishlist
          </Link>
        )}
      </div>

      {/* Search & Filters */}
      <SearchFilters onFilterChange={handleFilterChange} />

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-lg text-slate-600 dark:text-slate-400">Loading events...</div>
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
          <h2 className="text-2xl font-bold mb-2">No events found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Try adjusting your filters or search criteria
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-lg transition-all duration-200 group flex flex-col h-full"
            >
              {/* Event Poster */}
              <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={event.posterUrl || '/placeholder.svg'}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = '/placeholder.svg';
                  }}
                />

                {/* Wishlist Button */}
                <button
                  onClick={(e) => toggleWishlist(event._id, e)}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur transition-all ${
                    wishlistIds.has(event._id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  {wishlistIds.has(event._id) ? '❤️' : '🤍'}
                </button>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {event.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 flex-1">
                  {event.description}
                </p>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(event.date).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="line-clamp-1">{event.location}</span>
                </div>

                {/* Price & Map */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                  {event.price > 0 ? (
                    <span className="font-bold text-green-600 dark:text-green-400">₹{event.price}</span>
                  ) : (
                    <span className="font-bold text-green-600 dark:text-green-400">FREE</span>
                  )}

                  {event.latitude && event.longitude && (
                    <button
                      onClick={(e) => openMap(event, e)}
                      className="px-3 py-1 rounded text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      🗺️ Map
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
