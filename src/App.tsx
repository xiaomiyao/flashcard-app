import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StudyMode from './components/StudyMode';
import FeedbackForm from './components/FeedbackForm';
import FeedbackDisplay from './components/FeedbackDisplay';
import Login from './components/Login';
import Register from './components/Register';
import Settings from './components/Settings';
import { Flashcard, Progress } from './types';

// Sample flashcards data
const sampleFlashcards: Flashcard[] = [
  {
    id: '1',
    question: 'What is the purpose of the useEffect hook in React?',
    answer: 'useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.',
    category: 'React',
    difficulty: 'medium',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    question: 'What is the difference between let, const, and var in JavaScript?',
    answer: 'let and const are block-scoped, while var is function-scoped. const cannot be reassigned, let can be reassigned, and var can be both redeclared and reassigned.',
    category: 'JavaScript',
    difficulty: 'easy',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    question: 'What is the time complexity of binary search?',
    answer: 'O(log n) - Binary search divides the search space in half with each comparison, making it very efficient for sorted arrays.',
    category: 'Algorithms',
    difficulty: 'hard',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    question: 'What is the difference between SQL and NoSQL databases?',
    answer: 'SQL databases are relational and use structured query language, while NoSQL databases are non-relational and can store unstructured data in various formats.',
    category: 'Database',
    difficulty: 'medium',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    question: 'What is the purpose of TypeScript?',
    answer: 'TypeScript is a superset of JavaScript that adds static type checking, helping catch errors at compile time and improving code maintainability.',
    category: 'TypeScript',
    difficulty: 'easy',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    question: 'What is Dependency Injection (DI)?',
    answer: 'Dependency Injection is a design pattern where dependencies are provided to a class rather than the class creating them itself. This promotes loose coupling, testability, and inversion of control.',
    category: 'Design Patterns',
    difficulty: 'medium',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    question: 'What is Inversion of Control (IoC)?',
    answer: 'Inversion of Control is a principle where the control of object creation and dependency management is inverted from the object itself to an external container or framework. DI is one way to implement IoC.',
    category: 'Design Patterns',
    difficulty: 'hard',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '8',
    question: 'What are the different scopes in dependency injection?',
    answer: 'Common DI scopes include: Singleton (one instance per application), Transient (new instance every time), Scoped (one instance per request/scope), and Per-Thread (one instance per thread).',
    category: 'Design Patterns',
    difficulty: 'medium',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '9',
    question: 'What is an Interface in object-oriented programming?',
    answer: 'An interface defines a contract that classes must implement. It specifies what methods and properties a class must have without providing implementation details, enabling polymorphism and loose coupling.',
    category: 'OOP Concepts',
    difficulty: 'easy',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '10',
    question: 'What are Delegates in C#?',
    answer: 'Delegates are type-safe function pointers that can reference methods with matching signatures. They enable event handling, callbacks, and functional programming patterns in C#.',
    category: 'C#',
    difficulty: 'medium',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '11',
    question: 'What is the Singleton Pattern?',
    answer: 'Singleton ensures a class has only one instance and provides global access to it. Useful for logging, database connections, or configuration management, but can create tight coupling and testing difficulties.',
    category: 'Design Patterns',
    difficulty: 'easy',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '12',
    question: 'What is the Factory Pattern?',
    answer: 'Factory Pattern creates objects without specifying their exact class. It encapsulates object creation logic and provides a common interface for creating related objects.',
    category: 'Design Patterns',
    difficulty: 'medium',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '13',
    question: 'What is the Observer Pattern?',
    answer: 'Observer Pattern defines a one-to-many dependency between objects. When one object changes state, all dependent objects are notified and updated automatically.',
    category: 'Design Patterns',
    difficulty: 'medium',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '14',
    question: 'What is MVC (Model-View-Controller)?',
    answer: 'MVC separates application logic into three components: Model (data and business logic), View (user interface), and Controller (handles user input and coordinates between Model and View).',
    category: 'Architecture Patterns',
    difficulty: 'easy',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '15',
    question: 'What is MVVM (Model-View-ViewModel)?',
    answer: 'MVVM is an architectural pattern that separates UI logic from business logic. ViewModel acts as an intermediary between View and Model, often using data binding for automatic synchronization.',
    category: 'Architecture Patterns',
    difficulty: 'medium',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '16',
    question: 'What is the Repository Pattern?',
    answer: 'Repository Pattern abstracts data access logic and provides a uniform interface for accessing data. It decouples business logic from data access mechanisms and improves testability.',
    category: 'Design Patterns',
    difficulty: 'medium',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '17',
    question: 'What is the Unit of Work Pattern?',
    answer: 'Unit of Work maintains a list of objects affected by a business transaction and coordinates writing out changes. It ensures data consistency and manages transactions across multiple repositories.',
    category: 'Design Patterns',
    difficulty: 'hard',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '18',
    question: 'What is SOLID principles?',
    answer: 'SOLID stands for: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. These principles guide object-oriented design for maintainable and scalable code.',
    category: 'Design Principles',
    difficulty: 'hard',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '19',
    question: 'What is the Strategy Pattern?',
    answer: 'Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. It allows the algorithm to vary independently from clients that use it.',
    category: 'Design Patterns',
    difficulty: 'medium',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '20',
    question: 'What is the Command Pattern?',
    answer: 'Command Pattern encapsulates a request as an object, allowing you to parameterize clients with different requests, queue operations, and support undoable operations.',
    category: 'Design Patterns',
    difficulty: 'hard',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '21',
    question: 'What is Microservices Architecture?',
    answer: 'Microservices is an architectural approach where applications are built as a collection of loosely coupled, independently deployable services that communicate over well-defined APIs.',
    category: 'Architecture Patterns',
    difficulty: 'hard',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '22',
    question: 'What is Domain-Driven Design (DDD)?',
    answer: 'DDD is an approach to software development that focuses on modeling the business domain. It emphasizes collaboration between technical and domain experts to create a shared understanding.',
    category: 'Architecture Patterns',
    difficulty: 'hard',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '23',
    question: 'What is CQRS (Command Query Responsibility Segregation)?',
    answer: 'CQRS separates read and write operations into different models. Commands handle write operations, while Queries handle read operations, allowing for optimized data access patterns.',
    category: 'Architecture Patterns',
    difficulty: 'hard',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '24',
    question: 'What is Event Sourcing?',
    answer: 'Event Sourcing stores the state of an application as a sequence of events rather than storing the current state. It provides a complete audit trail and enables temporal queries.',
    category: 'Architecture Patterns',
    difficulty: 'hard',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '25',
    question: 'What is the Adapter Pattern?',
    answer: 'Adapter Pattern allows incompatible interfaces to work together by wrapping an existing class with a new interface. It acts as a bridge between two incompatible interfaces.',
    category: 'Design Patterns',
    difficulty: 'medium',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

function App() {
  const [flashcards] = useState<Flashcard[]>(sampleFlashcards);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showFeedbackDisplay, setShowFeedbackDisplay] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string } | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Initialize demo users and check for existing session
  useEffect(() => {
    // Create demo users if they don't exist
    const existingUsers = JSON.parse(localStorage.getItem('flashcard-users') || '[]');
    if (existingUsers.length === 0) {
      const demoUsers = [
        { id: '1', username: 'admin', email: 'admin@example.com', password: 'password123', createdAt: new Date().toISOString() },
        { id: '2', username: 'user', email: 'user@example.com', password: 'password123', createdAt: new Date().toISOString() },
        { id: '3', username: 'demo', email: 'demo@example.com', password: 'demo123', createdAt: new Date().toISOString() }
      ];
      localStorage.setItem('flashcard-users', JSON.stringify(demoUsers));
    }

    // Check for existing session
    const savedUser = localStorage.getItem('flashcard-current-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setCurrentUser({ username: userData.username, email: userData.email });
      } catch (error) {
        localStorage.removeItem('flashcard-current-user');
      }
    }
  }, []);

  const handleSessionComplete = (progress: Progress) => {
    console.log('Session completed:', progress);
  };

  const handleFeedbackSubmit = (feedback: any) => {
    console.log('Feedback submitted:', feedback);
    
    // Save to localStorage
    try {
      const existingFeedback = JSON.parse(localStorage.getItem('flashcard-feedback') || '[]');
      const newFeedback = {
        ...feedback,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
      existingFeedback.push(newFeedback);
      localStorage.setItem('flashcard-feedback', JSON.stringify(existingFeedback));
      console.log('Feedback saved to localStorage');
    } catch (error) {
      console.error('Error saving feedback to localStorage:', error);
    }

    // Option 1: Send to backend API (uncomment when you have a backend)
    /*
    fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback)
    })
    .then(response => response.json())
    .then(data => console.log('Feedback saved to backend:', data))
    .catch(error => console.error('Error saving to backend:', error));
    */

    // Option 2: Send to external service (like Formspree, Netlify Forms, etc.)
    /*
    fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback)
    })
    .then(response => response.json())
    .then(data => console.log('Feedback sent to Formspree:', data))
    .catch(error => console.error('Error sending to Formspree:', error));
    */
  };

  const handleLogin = (user: { username: string; email: string }) => {
    setCurrentUser(user);
    setShowLogin(false);
    setAuthMode('login');
  };

  const handleRegister = (user: { username: string; email: string }) => {
    setCurrentUser(user);
    setShowRegister(false);
    setAuthMode('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('flashcard-current-user');
  };

  const handleAuthModeSwitch = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Flashcard App</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {flashcards.length} cards
              </div>
              
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600">
                    Welcome, <span className="font-medium text-gray-900">{currentUser.username}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      setAuthMode('login');
                      setShowLogin(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => {
                      setAuthMode('register');
                      setShowRegister(true);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Register
                  </button>
                </div>
              )}
              
              <button 
                onClick={() => setShowFeedbackForm(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                title="Feedback"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button 
                onClick={() => setShowFeedbackDisplay(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                title="View Feedback"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StudyMode
            flashcards={flashcards}
            onSessionComplete={handleSessionComplete}
            timerMode={false}
          />
        </motion.div>
      </main>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowFeedbackForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <FeedbackForm
                onClose={() => setShowFeedbackForm(false)}
                onSubmit={handleFeedbackSubmit}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Display Modal */}
      <AnimatePresence>
        {showFeedbackDisplay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowFeedbackDisplay(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <FeedbackDisplay
                onClose={() => setShowFeedbackDisplay(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowLogin(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Login
                onLogin={handleLogin}
                onSwitchToRegister={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
                onClose={() => setShowLogin(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Register Modal */}
      <AnimatePresence>
        {showRegister && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowRegister(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Register
                onRegister={handleRegister}
                onSwitchToLogin={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
                onClose={() => setShowRegister(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Settings
                onClose={() => setShowSettings(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;