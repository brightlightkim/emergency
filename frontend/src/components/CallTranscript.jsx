import React from 'react';

const CallTranscript = ({ transcript }) => {
  if (!transcript) return null;
  
  // Parse transcript into conversation parts (simple version)
  // In a real app, you'd use a more sophisticated approach to structure the conversation
  const conversationParts = transcript.split('\n').filter(line => line.trim() !== '');
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Emergency Call Transcript</h2>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-3">
            {conversationParts.map((part, index) => {
              const isSystemMessage = part.startsWith('System:');
              const isAgentMessage = part.startsWith('Agent:');
              const isUserMessage = part.startsWith('User:') || part.startsWith('Caller:');
              
              let className = "p-3 rounded-lg";
              
              if (isSystemMessage) {
                className += " bg-gray-200 text-gray-700";
              } else if (isAgentMessage) {
                className += " bg-blue-100 text-gray-800";
              } else if (isUserMessage) {
                className += " bg-green-100 text-gray-800";
              } else {
                className += " bg-gray-100 text-gray-700";
              }
              
              return (
                <div key={index} className={className}>
                  {part}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="text-sm text-gray-500 italic">
          This transcript was generated automatically and may not be 100% accurate.
        </div>
      </div>
    </div>
  );
};

export default CallTranscript;
