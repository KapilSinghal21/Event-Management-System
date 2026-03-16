import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import MapDisplay from '../components/MapDisplay.jsx';

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [toast, setToast] = useState({ open: false, type: 'info', message: '' });

  const showToast = (type, message) => {
    setToast({ open: true, type, message });
    setTimeout(() => setToast({ open: false, type: 'info', message: '' }), 5000);
  };

  useEffect(() => {
    load();
    // Scroll to top when component mounts or id changes
    window.scrollTo(0, 0);
  }, [id, user]);

  async function load() {
    const [e, r] = await Promise.all([
      axios.get(`/api/events/${id}`),
      axios.get(`/api/reviews/${id}`),
    ]);
    setEvent(e.data.event);
    setReviews(r.data.reviews || []);
    
    // Check if current user has already reviewed this event
    if (user) {
      const userReview = r.data.reviews?.find(review => review.user?._id === user.id);
      setHasReviewed(!!userReview);
      
      // Check if user is already registered
      try {
        const regRes = await axios.get(`/api/registrations/me`);
        const userIsRegistered = regRes.data.registrations?.some(reg => reg.event?._id === id);
        setIsRegistered(!!userIsRegistered);
      } catch (error) {
        setIsRegistered(false);
      }
    }
  }

  async function register() {
    try {
      if (!user) {
        showToast('warning', 'Please log in to register for this event.');
        return;
      }

      if (isRegistered) {
        showToast('info', 'You are already registered for this event!');
        return;
      }

      // Proceed with registration
      await axios.post(`/api/registrations/${id}/register`);
      showToast('success', 'Registered! Check your email for confirmation.');
      setIsRegistered(true);
      
      // Refresh event data to update UI
      await load();
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 401) {
        showToast('warning', 'Please log in to register for this event.');
      } else if (error.response?.status === 400) {
        showToast('warning', error.response.data.message || 'Unable to register for this event.');
      } else {
        showToast('error', 'Failed to register. Please try again later.');
      }
    }
  }

  function shareEvent() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: event.title, text: event.description, url }).catch(()=>{});
    } else {
      navigator.clipboard.writeText(url); alert('Event link copied!');
    }
  }

  function downloadIcs() {
    const start = new Date(event.date);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CampusEvents//EN\nBEGIN:VEVENT\nUID:${event._id}@campus\nDTSTAMP:${start.toISOString().replace(/[-:]/g,'').split('.')[0]}Z\nDTSTART:${start.toISOString().replace(/[-:]/g,'').split('.')[0]}Z\nDTEND:${end.toISOString().replace(/[-:]/g,'').split('.')[0]}Z\nSUMMARY:${event.title}\nDESCRIPTION:${event.description}\nLOCATION:${event.location}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${event.title}.ics`; a.click(); URL.revokeObjectURL(url);
  }

  async function submitReview() {
    try {
      console.log('Submitting review:', { rating, comment, eventId: id, user: user?.id });
      console.log('Auth token:', axios.defaults.headers.common.Authorization);
      
      const response = await axios.post(`/api/reviews/${id}`, { rating, comment });
      console.log('Review submitted successfully:', response.data);
      showToast('success', 'Review posted successfully!');
      setComment('');
      await load();
    } catch (error) {
      console.error('Review submission error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        showToast('warning', 'Please log in to post a review.');
      } else if (error.response?.status === 400 && error.response?.data?.message?.includes('reviewed')) {
        showToast('info', 'You have already reviewed this event.');
      } else {
        showToast('error', `Failed to post review: ${error.response?.data?.message || 'Please try again.'}`);
      }
    }
  }

  if (!event) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading event details...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast.open && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white font-medium flex items-center gap-3 animate-toast ${
          toast.type==='success'?'bg-green-600':
          toast.type==='warning'?'bg-yellow-600':
          toast.type==='error'?'bg-red-600':'bg-blue-600'
        }`}>
          <span>{toast.message}</span>
          <button className="opacity-80 hover:opacity-100 ml-2" onClick={()=>setToast({ ...toast, open:false })}>×</button>
        </div>
      )}
      
      {/* Hero Section */}
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Event Image */}
        <div className="md:col-span-2">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
            <img 
              src={event.posterUrl || '/placeholder.svg'} 
              className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300" 
              alt={event.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <span className={`inline-block px-4 py-2 rounded-full text-white font-semibold text-sm backdrop-blur-md ${
                event.status === 'approved' ? 'bg-green-500/80' : 
                event.status === 'pending' ? 'bg-yellow-500/80' : 
                'bg-red-500/80'
              }`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Event Info Sidebar */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Event Details</p>
              <h1 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">{event.title}</h1>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-indigo-200 dark:border-indigo-800">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Date & Time</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{new Date(event.date).toLocaleTimeString()}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Location</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{event.location}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Category</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{event.category}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            !user 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
              : isRegistered
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105'
          }`}
          onClick={register}
          disabled={!user || isRegistered}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRegistered ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
          </svg>
          {isRegistered ? 'Registered' : 'Register Now'}
        </button>
        <button 
          className="px-6 py-3 rounded-xl font-semibold border-2 border-indigo-600 dark:border-indigo-400 
            text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 
            transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
          onClick={shareEvent}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C9.589 12.938 10 12.502 10 12c0-.502-.411-.938-1.316-1.342m0 2.684a3 3 0 110-2.684m9.316-1.342C14.411 10.938 14 11.502 14 12c0 .502.411.938 1.316 1.342m0-2.684a3 3 0 010 2.684m0 0a6 6 0 100-12 6 6 0 000 12z" />
          </svg>
          Share
        </button>
        <button 
          className="px-6 py-3 rounded-xl font-semibold border-2 border-slate-300 dark:border-slate-600 
            text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 
            transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
          onClick={downloadIcs}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Calendar
        </button>
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">About this event</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{event.description}</p>
      </div>

      {/* Map Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.553-.894L9 7m0 0l6.447-3.276A1 1 0 0117 5v12.618a1 1 0 01-.553.894L11 20m0 0H9m2 0h8m-6-2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Event Location
        </h2>
        <MapDisplay latitude={event.latitude} longitude={event.longitude} locationName={event.location} />
      </div>

      {/* Reviews Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Reviews & Ratings</h2>
        
        {user && !hasReviewed && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800 p-4 mb-6">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-4">Share your experience</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Rating:</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      className={`text-2xl transition-transform duration-200 ${
                        n <= rating ? 'text-amber-400 scale-110' : 'text-slate-300 dark:text-slate-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{rating}/5</span>
              </div>
              <textarea 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 resize-none" 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                placeholder="Share your thoughts about this event..."
                rows="3"
              />
              <button 
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={submitReview} 
                disabled={!comment.trim()}
              >
                Post Review
              </button>
            </div>
          </div>
        )}

        {user && hasReviewed && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800 dark:text-green-200 font-medium">You have already reviewed this event.</p>
          </div>
        )}
        
        {/* Reviews List */}
        <div className="space-y-3">
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div key={r._id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{r.user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < r.rating ? 'text-amber-400 text-lg' : 'text-slate-300 dark:text-slate-600 text-lg'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{r.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
}
