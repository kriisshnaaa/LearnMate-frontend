// learnmate/client/src/components/ChatBox.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatBox = ({ roadmapData }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. You can ask me questions about your learning roadmap.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send question to AI API
      const response = await axios.post('https://learnmate-backend-4nv0.onrender.com/api/openai/chat', {
        question: inputValue,
        roadmapContext: roadmapData
      });

      // Add AI response
      const aiMessage = {
        id: messages.length + 2,
        text: response.data.answer || "I received your question but couldn't generate a proper response.",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat API error:', error);
      let errorText = "Sorry, I encountered an error. Please try again.";
      
      if (error.response) {
        // Server responded with error
        errorText = error.response.data.message || "Server error occurred.";
      } else if (error.request) {
        // Request made but no response
        errorText = "Unable to connect to AI service. Please check if the server is running.";
      }
      
      const errorMessage = {
        id: messages.length + 2,
        text: errorText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
        <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
        <p className="text-sm text-blue-100">Ask me anything about your learning roadmap</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 bg-gray-50 dark:bg-gray-900">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your roadmap..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
