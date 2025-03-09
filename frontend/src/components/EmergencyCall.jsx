import React, { useState, useEffect } from 'react';
import { initiateEmergencyCall, checkCallStatus } from '../api/index';

const EmergencyCall = ({ onCallCompleted, setLoading }) => {
  const [callState, setCallState] = useState('idle'); // idle, calling, completed, failed
  const [callId, setCallId] = useState(null);
  const [callResult, setCallResult] = useState(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);

  // Start the emergency call
  const startEmergencyCall = async () => {
    try {
      setLoading(true);
      setCallState('calling');
      const result = await initiateEmergencyCall();
      setCallId(result.call_id);
      
      // Start checking call status
      const interval = setInterval(checkStatus, 5000); // Check every 5 seconds
      setStatusCheckInterval(interval);
    } catch (error) {
      console.error('Error starting emergency call:', error);
      setCallState('failed');
      setLoading(false);
    }
  };

  // Check the current call status
  const checkStatus = async () => {
    if (!callId) return;
    
    try {
      const result = await checkCallStatus(callId);
      
      // If call has ended, clean up and notify parent
      if (result.status === 'ended') {
        clearInterval(statusCheckInterval);
        setCallState('completed');
        setCallResult(result);
        setLoading(false);
        onCallCompleted({
          transcript: result.transcript,
          recordingUrl: result.recording_url
        });
      }
    } catch (error) {
      console.error('Error checking call status:', error);
      // Don't change state on error, just log it
    }
  };

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Emergency Call Assistant</h2>
      
      <div className="space-y-4">
        {callState === 'idle' && (
          <div className="text-center">
            <p className="mb-4 text-gray-700">
              Our AI assistant can call emergency services for you and provide your location information.
            </p>
            <button
              onClick={startEmergencyCall}
              className="bg-emergency-red text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center justify-center mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call Emergency Services
            </button>
          </div>
        )}
        
        {callState === 'calling' && (
          <div className="text-center">
            <div className="animate-pulse bg-emergency-red h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <p className="font-medium">Emergency call in progress...</p>
            <p className="text-sm text-gray-500 mt-2">Stay on the page while we connect your call</p>
          </div>
        )}
        
        {callState === 'failed' && (
          <div className="text-center">
            <div className="bg-emergency-red h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="font-medium text-emergency-red">Call failed to connect</p>
            <button
              onClick={startEmergencyCall}
              className="mt-4 bg-emergency-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        )}
        
        {callState === 'completed' && callResult && (
          <div className="text-center">
            <div className="bg-emergency-green h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="font-medium text-emergency-green">Call completed</p>
            <p className="text-sm text-gray-500 mt-2">Please see the emergency route information below</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyCall;
