
import React from "react";
import { StudentLayout } from "@/components/layout/student-layout";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const { user } = useAuth();

  const featuredCards = [
    {
      title: "AI English Tutor",
      description: "Practice your English skills with our AI tutor. Ask grammar questions or have conversations.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      linkTo: "/student/ai-chat",
      color: "bg-indigo-50 hover:bg-indigo-100",
    },
    {
      title: "Chat with Teachers",
      description: "Have questions about your lessons? Chat directly with your teachers for help.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      linkTo: "/student/chat",
      color: "bg-green-50 hover:bg-green-100",
    },
  ];

  const tips = [
    "Practice speaking English every day, even if it's just for a few minutes.",
    "Listen to English music, podcasts, or watch movies in English to improve your listening skills.",
    "Read English books, articles, or news to expand your vocabulary.",
    "Use our AI tutor to practice conversations in different scenarios.",
    "Don't be afraid to make mistakes - they're part of the learning process!",
  ];

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>

        {/* Featured Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredCards.map((card, index) => (
            <Link
              key={index}
              to={card.linkTo}
              className={`${card.color} p-6 rounded-lg shadow-sm transition-colors`}
            >
              <div className="flex flex-col items-center text-center">
                {card.icon}
                <h3 className="mt-4 text-lg font-medium text-gray-900">{card.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Learning Tips */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">English Learning Tips</h3>
          <ul className="space-y-3">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-gray-600">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <svg className="h-16 w-16 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Ready to start learning?</h3>
              <p className="mt-2 text-gray-600">
                Your English learning journey starts here. Use the AI tutor to practice
                conversations, check grammar, and expand your vocabulary. If you need
                help, your teachers are just a message away.
              </p>
              <div className="mt-4">
                <Link
                  to="/student/ai-chat"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Start Practicing
                  <svg className="ml-2 -mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
