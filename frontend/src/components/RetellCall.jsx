import React, { useState, useEffect } from 'react';

function RetellCall({ onCallCompleted, setLoading }) {
  const [callInProgress, setCallInProgress] = useState(false);
  const [callId, setCallId] = useState(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  
  // Handle initiating the call
  const initiateCall = async () => {
    try {
      setLoading(true);
      setCallInProgress(true);
      
      const response = await fetch('http://localhost:8000/emergency-call/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.call_id) {
        setCallId(data.call_id);
        // Start checking call status every 5 seconds
        const interval = setInterval(() => checkCallStatus(data.call_id), 5000);
        setStatusCheckInterval(interval);
      } else {
        console.error('Failed to initiate call:', data);
        setCallInProgress(false);
      }
    } catch (error) {
      console.error('Error initiating call:', error);
      setCallInProgress(false);
    } finally {
      setLoading(false);
    }
  };
  
  // Check the status of the ongoing call
  const checkCallStatus = async (id) => {
    try {
      const response = await fetch('http://localhost:8000/call-status/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ call_id: id }),
      });
      
      const data = await response.json();
      
      if (data.status === 'completed') {
        clearInterval(statusCheckInterval);
        setCallInProgress(false);
        onCallCompleted({
          transcript: data.transcript || "No transcript available",
          // Add any other data you want to pass back
        });
      }
    } catch (error) {
      console.error('Error checking call status:', error);
    }
  };
  
  // Clean up interval when component unmounts
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Emergency Call Service</h2>
      
      {!callInProgress ? (
        <div className="text-center">
          <p className="mb-4">
            Connect with an AI emergency response agent who can help assess your situation
            and provide immediate guidance.
          </p>
          <button
            onClick={initiateCall}
            className="bg-emergency-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center space-x-2 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
            </svg>
            <span>Call Emergency Agent</span>
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="inline-block animate-pulse-fast bg-emergency-red h-16 w-16 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
            </svg>
          </div>
          <p className="text-lg font-medium">Call in progress...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we connect you with our emergency response agent</p>
        </div>
      )}
    </div>
  );
}

export default RetellCall;
