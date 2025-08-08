// learnmate/client/src/components/SearchBar.jsx
import React from 'react';

function SearchBar({ topic, setTopic, duration, setDuration, fetchRoadmaps }) {
  const handleGenerate = () => {
    if (topic.trim() && duration.trim()) {
      fetchRoadmaps();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            What do you want to learn?
          </label>
          <input
            type="text"
            placeholder="e.g., React, AI, Data Science..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            How much time do you have?
          </label>
          <input
            type="text"
            placeholder="e.g., 2 months, 30 days..."
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
        <div className="w-full md:w-auto pt-5 md:pt-0">
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || !duration.trim()}
            className="w-full mt-5 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
          >
            <span>Generate Roadmaps</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
