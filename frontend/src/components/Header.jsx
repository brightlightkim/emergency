import React from 'react';

const Header = () => {
  return (
    <header className="bg-emergency-red text-white py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          <h1 className="text-2xl font-bold">Emergency Response</h1>
        </div>
        <div className="emergency-indicator flex items-center">
          <span className="inline-block h-3 w-3 rounded-full bg-emergency-green animate-pulse mr-2"></span>
          <span className="text-sm">AI Assistant Ready</span>
        </div>
      </div>
    </header>
  );
};

export default Header;