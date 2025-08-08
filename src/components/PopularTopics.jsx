// src/components/PopularTopics.jsx
import React from 'react';

const topics = ['Machine Learning', 'Web Development', 'Blockchain', 'Data Science'];

function PopularTopics({ setTopic, fetchRoadmaps }) {
  const handleClick = (topic) => {
    setTopic(topic);
    fetchRoadmaps(); // Call fetchRoadmaps after setting topic
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-6">
      {topics.map((t, i) => (
        <button
          key={i}
          onClick={() => handleClick(t)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow"
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default PopularTopics;
