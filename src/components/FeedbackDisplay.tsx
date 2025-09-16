import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackData {
  id: string;
  name: string;
  email: string;
  rating: number;
  category: string;
  comment: string;
  timestamp: string;
}

interface FeedbackDisplayProps {
  onClose?: () => void;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ onClose }) => {
  const [feedback, setFeedback] = useState<FeedbackData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedFeedback = JSON.parse(localStorage.getItem('flashcard-feedback') || '[]');
      setFeedback(savedFeedback);
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      general: 'bg-blue-100 text-blue-800',
      bug: 'bg-red-100 text-red-800',
      feature: 'bg-green-100 text-green-800',
      ui: 'bg-purple-100 text-purple-800',
      performance: 'bg-yellow-100 text-yellow-800',
      content: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto max-h-[80vh] overflow-hidden flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Feedback History</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {feedback.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
          <p className="text-gray-500">Be the first to share your thoughts about the app!</p>
        </div>
      ) : (
        <div className="overflow-y-auto flex-1">
          <div className="space-y-4">
            {feedback.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {item.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">{formatDate(item.timestamp)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>
                    <div className="flex items-center space-x-1">
                      {renderStars(item.rating)}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{item.comment}</p>
                
                {item.email && (
                  <p className="text-sm text-gray-500 mt-2">
                    Contact: {item.email}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FeedbackDisplay;
