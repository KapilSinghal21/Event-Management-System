import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, type: 'info', message: '' });
  const navigate = useNavigate();

  const showToast = (type, message) => {
    setToast({ open: true, type, message });
    setTimeout(() => setToast({ open: false, type: 'info', message: '' }), 3000);
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    try {
      const res = await axios.get('/api/wishlist');
      setWishlist(res.data.wishlist || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      showToast('error', 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }

  async function removeFromWishlist(eventId) {
    try {
      await axios.delete(`/api/wishlist/${eventId}`);
      setWishlist(wishlist.filter(w => w.event._id !== eventId));
      showToast('success', 'Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showToast('error', 'Failed to remove from wishlist');
    }
  }

  function openMap(latitude, longitude) {
    if (latitude && longitude) {
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(mapsUrl, '_blank');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast.open && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white font-medium flex items-center gap-3 animate-toast ${
          toast.type === 'success'
            ? 'bg-green-600'
            : toast.type === 'error'
            ? 'bg-red-600'
            : 'bg-blue-600'
        }`}>
          <span>{toast.message}</span>
          <button className="opacity-80 hover:opacity-100 ml-2" onClick={() => setToast({ ...toast, open: false })}>×</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">My Wishlist</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">{wishlist.length} event{wishlist.length !== 1 ? 's' : ''} saved</p>
        </div>
        <button
          onClick={() => navigate('/explore')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 text-white font-semibold transition-all duration-200 flex items-center gap-2 hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Explore More
        </button>
      </div>

      {wishlist.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-16 text-center">
          <svg className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
          </svg>
          <h2 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white">Your wishlist is empty</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Start exploring events and add your favorites to your wishlist to keep track of events you're interested in.
          </p>
          <button
            onClick={() => navigate('/explore')}
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 hover:scale-105"
          >
            Browse Events Now
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {wishlist.map((w) => (
            <div
              key={w._id}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-6 p-6">
                {/* Event Poster */}
                {w.event.posterUrl && (
                  <div className="lg:w-56 flex-shrink-0">
                    <img
                      src={w.event.posterUrl}
                      alt={w.event.title}
                      className="w-full h-48 lg:h-56 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Event Details */}
                <div className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-2 text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline"
                      onClick={() => navigate(`/events/${w.event._id}`)}>
                      {w.event.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2">{w.event.description}</p>
                  </div>

                  {/* Event Info Grid */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="inline-block px-3 py-1.5 rounded-full text-sm font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                        {w.event.category}
                      </span>
                      {w.event.price > 0 ? (
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          ₹{w.event.price.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">FREE</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{new Date(w.event.date).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })} at {new Date(w.event.date).toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="font-medium">{w.event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap mt-auto">
                    <button
                      onClick={() => navigate(`/events/${w.event._id}`)}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      View Details
                    </button>

                    {w.event.latitude && w.event.longitude && (
                      <button
                        onClick={() => openMap(w.event.latitude, w.event.longitude)}
                        className="flex-1 px-4 py-2.5 rounded-lg border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.553-.894L9 7m0 0l6.447-3.276A1 1 0 0117 5v12.618a1 1 0 01-.553.894L11 20m0 0H9m2 0h8m-6-2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Map
                      </button>
                    )}

                    <button
                      onClick={() => removeFromWishlist(w.event._id)}
                      className="px-4 py-2.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
