import { useState } from 'react';

export default function SearchFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      q: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      startDate: '',
      endDate: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Search & Filter Events</h2>
        <button
          onClick={handleReset}
          className="text-sm px-3 py-1 text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Search */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Search Events</label>
          <input
            type="text"
            name="q"
            placeholder="Event name, keyword..."
            value={filters.q}
            onChange={handleChange}
            className="input w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
          />
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="input w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
          >
            <option value="">All Categories</option>
            <option value="Tech">Tech</option>
            <option value="Sports">Sports</option>
            <option value="Cultural">Cultural</option>
            <option value="Workshop">Workshop</option>
          </select>
        </div>

        {/* Min Price */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Min Price (₹)</label>
          <input
            type="number"
            name="minPrice"
            placeholder="0"
            value={filters.minPrice}
            onChange={handleChange}
            min="0"
            className="input w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
          />
        </div>

        {/* Max Price */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Max Price (₹)</label>
          <input
            type="number"
            name="maxPrice"
            placeholder="10000"
            value={filters.maxPrice}
            onChange={handleChange}
            min="0"
            className="input w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
          />
        </div>

        {/* Start Date */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">From Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="input w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
          />
        </div>

        {/* End Date */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">To Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="input w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}
