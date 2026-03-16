export default function MapDisplay({ latitude, longitude, locationName }) {
  if (!latitude || !longitude) {
    return (
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700">
        <svg className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.553-.894L9 7m0 0l6.447-3.276A1 1 0 0117 5v12.618a1 1 0 01-.553.894L11 20m0 0H9m2 0h8m-6-2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-slate-600 dark:text-slate-400 font-medium">No location coordinates provided</p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Organizer can add coordinates for map display</p>
      </div>
    );
  }

  const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDiqI_7S_BLwD3mHGhDR4a5yWZxYrxh7pY&q=${latitude},${longitude}`;

  return (
    <div className="space-y-4">
      {/* Static Map Preview */}
      <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 group">
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="block relative">
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x400&markers=color:red%7C${latitude},${longitude}&key=AIzaSyDiqI_7S_BLwD3mHGhDR4a5yWZxYrxh7pY`}
            alt={`Map of ${locationName}`}
            className="w-full h-96 object-cover group-hover:opacity-75 transition-opacity duration-300"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
            <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in Google Maps
            </div>
          </div>
        </a>
      </div>

      {/* Coordinates Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Location Coordinates</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-900/50 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Latitude</p>
            <p className="text-lg font-mono font-bold text-slate-900 dark:text-white">{latitude.toFixed(4)}</p>
          </div>
          <div className="bg-white dark:bg-slate-900/50 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Longitude</p>
            <p className="text-lg font-mono font-bold text-slate-900 dark:text-white">{longitude.toFixed(4)}</p>
          </div>
        </div>
      </div>

      {/* Open in Maps Button */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-center transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
      >
        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        View Full Map in Google Maps
      </a>
    </div>
  );
}
