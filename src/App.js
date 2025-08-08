// learnmate/client/src/App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, transform } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import SearchBar from './components/SearchBar.jsx';
import Loader from './components/Loader.jsx';
import PopularTopics from './components/PopularTopics.jsx';
import RoadmapList from './components/RoadMapList.jsx';
import ChatBox from './components/ChatBox.jsx';
// Spline removed – animated background added below

function App() {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('');
  const [roadmapList, setRoadmapList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [splineError, setSplineError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const fetchRoadmaps = async () => {
    if (!topic.trim() || !duration.trim()) return;
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/openai/roadmap", {
        topic,
        duration,
      });

      const rawText = res.data.roadmaps[0];
      const roadmapSections = rawText.split(/(?=Roadmap \d+:)/g).filter(section => section.trim());
      setRoadmapList(roadmapSections);
    } catch (err) {
      console.error("Error:", err);
      alert("Error generating roadmap. Check server or API.");
    }

    setLoading(false);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleSelectRoadmap = (index) => {
    setSelectedIndex(index);
    setActiveRoadmap(roadmapList[index]);
    setShowChat(true);
  };

  const handleSplineError = () => {
    console.error('Spline scene failed to load');
    setSplineError(true);
  };

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-3xl"
            style={{ top: '10%', left: '10%' }}
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 opacity-20 blur-3xl"
            style={{ bottom: '10%', right: '10%' }}
            animate={{
              x: [0, -80, 0],
              y: [0, -60, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      <Navbar />

      {/* Main Content */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">

          {/* Welcome Message */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 1 }}
                className="bg-blue-600 rounded-lg p-4 mb-6 shadow-lg text-center font-semibold text-white"
              >
                Welcome to LearnMate! Ask me anything about your learning roadmap.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Area */}
          <motion.div 
            initial={{ y: roadmapList.length > 0 ? -100 : 0 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className={`${roadmapList.length > 0 ? "pt-8" : "flex items-center justify-center min-h-[70vh]"}`}
          >
            {roadmapList.length === 0 ? (
              <div className="text-center w-full max-w-2xl">
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold mb-8 flex items-center justify-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mr-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  LearnMate
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <SearchBar
                    topic={topic}
                    setTopic={setTopic}
                    duration={duration}
                    setDuration={setDuration}
                    fetchRoadmaps={fetchRoadmaps}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8"
                >
                  <PopularTopics setTopic={setTopic} fetchRoadmaps={fetchRoadmaps} />
                </motion.div>
              </div>
            ) : (
              <>
                <SearchBar
                  topic={topic}
                  setTopic={setTopic}
                  duration={duration}
                  setDuration={setDuration}
                  fetchRoadmaps={fetchRoadmaps}
                />
                <PopularTopics setTopic={setTopic} fetchRoadmaps={fetchRoadmaps} />
              </>
            )}
          </motion.div>

          {/* Floating Bot */}
          {/* (code unchanged) */}

          {/* Chat Toggle */}
          {/* (code unchanged) */}

          {loading && <Loader />}

          {!loading && selectedIndex === null && roadmapList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8"
            >
              <div className="lg:col-span-2">
                <RoadmapList roadmapList={roadmapList} setSelectedIndex={handleSelectRoadmap} />
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold mb-4">Roadmap Summary</h3>
                  <p className="text-gray-200">
                    You've generated {roadmapList.length} different learning roadmaps for {topic}.
                    Each roadmap provides a unique approach to mastering this topic in {duration}.
                  </p>
                  <button
                    onClick={() => setShowChat(true)}
                    className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white py-2 px-4 rounded transition"
                  >
                    Ask AI About This Roadmap
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {selectedIndex !== null && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => {
                    setSelectedIndex(null);
                    setActiveRoadmap(null);
                    setShowChat(false);
                  }}
                  className="px-4 py-2 bg-gray-300 bg-opacity-20 backdrop-blur-md text-gray-800 rounded hover:bg-gray-400 hover:bg-opacity-30 transition flex items-center"
                >
                  ← Back to All Roadmaps
                </button>
                <button
                  onClick={() => setShowChat(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white rounded transition flex items-center"
                >
                  💬 Ask AI Questions
                </button>
              </div>

              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4"
              >
                <RoadmapList
                  roadmapList={[roadmapList[selectedIndex]]}
                  setSelectedIndex={() => {
                    setSelectedIndex(null);
                    setActiveRoadmap(null);
                    setShowChat(false);
                  }}
                />
              </motion.div>
            </div>
          )}

          <AnimatePresence>
            {showChat && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              >
                <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl relative">
                  <ChatBox roadmapData={activeRoadmap ? [activeRoadmap] : []} />
                  <button
                    onClick={() => setShowChat(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold p-2"
                    aria-label="Close chat"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div> {/* max-w-6xl container */}
      </div> {/* relative z-10 */}
    </div> // main app wrapper
  );
}

export default App;
