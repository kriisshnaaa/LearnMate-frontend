import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RoadmapList = ({ roadmapList, setSelectedIndex, selectedIndex }) => {
  // State to track which roadmap is expanded
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  // Function to parse roadmap items into structured format
  const parseRoadmap = (roadmapText) => {
    // Split by numbered items
    const items = roadmapText.split(/\n(?=\d+\.)/).filter(item => item.trim());
    
    return items.map((item, idx) => {
      // Extract title and description
      const lines = item.trim().split('\n');
      const title = lines[0].replace(/^\d+\.\s*/, '');
      const description = lines.slice(1).join('\n').trim();
      
      return {
        id: idx,
        title,
        description
      };
    });
  };

  // Function to truncate text to a specified number of lines
  const truncateText = (text, maxLines = 3) => {
    if (!text) return '';
    const lines = text.split('\n');
    if (lines.length <= maxLines) return text;
    return lines.slice(0, maxLines).join('\n') + '...';
  };

  return (
    <div className="space-y-6 mt-6">
      {roadmapList.map((roadmap, index) => {
        const parsedItems = parseRoadmap(roadmap);
        const isExpanded = expandedIndex === index;
        const isSelected = selectedIndex !== null ? (selectedIndex === index) : false;
        // In single view (only one roadmap), always show full content
        const isSingleView = roadmapList.length === 1;
        // Show only first 3 items when not expanded, not selected, and not in single view
        const displayItems = (isExpanded || isSelected || isSingleView) ? parsedItems : parsedItems.slice(0, 3);
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition"
              onClick={() => {
                // If setSelectedIndex is provided, use it to select the roadmap
                if (setSelectedIndex) {
                  setSelectedIndex(index);
                }
                // Always expand/collapse locally
                setExpandedIndex(isExpanded ? null : index);
              }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Roadmap {index + 1}</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {parsedItems.length} steps
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700">
              {displayItems.map((item, itemIndex) => (
                <div 
                  key={item.id} 
                  className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <div 
                    className="p-4"
                  >
                    <div className="w-full">
                      <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
                        <span className="mr-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                          {itemIndex + 1}
                        </span>
                        {item.title}
                      </h3>
                      <div className="mt-2 ml-8">
                        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                          {(isExpanded || isSelected || isSingleView)
                            ? (item.description || 'No additional details available.') 
                            : truncateText(item.description, 2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Show "Show more" only when not expanded, not selected, not in single view, and there are more items */}
              {!isExpanded && !isSelected && !isSingleView && parsedItems.length > 3 && (
                <div 
                  className="p-4 text-center cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (setSelectedIndex) {
                      setSelectedIndex(index);
                    }
                    setExpandedIndex(index);
                  }}
                >
                  Show all {parsedItems.length} steps...
                </div>
              )}
              
              {/* Show "Show less" when expanded */}
              {isExpanded && (
                <div 
                  className="p-4 text-center cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedIndex(null);
                  }}
                >
                  Show less
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RoadmapList;

