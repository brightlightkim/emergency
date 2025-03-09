import React, { useEffect, useState } from 'react';
import { getFirstAidResponse } from '../api';

const ResponseDisplay = ({ emergencyData, setLoading, onFirstAidResponse }) => {
  const [processingFirstAid, setProcessingFirstAid] = useState(true);
  
  useEffect(() => {
    const fetchFirstAidResponse = async () => {
      try {
        setLoading(true);
        const response = await getFirstAidResponse({
          transcription: emergencyData.transcription,
          image_result: emergencyData.imageResult
        });
        onFirstAidResponse(response);
      } catch (error) {
        console.error('Error getting first aid response:', error);
        alert('Failed to generate first aid instructions. Please try again.');
      } finally {
        setLoading(false);
        setProcessingFirstAid(false);
      }
    };
    
    fetchFirstAidResponse();
  }, [emergencyData, setLoading, onFirstAidResponse]);
  
  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">Emergency Information Processing</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Your Emergency Description:</h3>
          <p className="text-gray-700">{emergencyData.transcription}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Scene Analysis:</h3>
          <div className="text-gray-700 text-sm">
            {emergencyData.imageResult.has_emergency ? (
              <div>
                <p className="font-bold text-emergency-red mb-2">Emergency situation detected:</p>
                <ul className="list-disc list-inside">
                  {emergencyData.imageResult.emergency_detections.map((item, index) => (
                    <li key={index}>
                      {item.class} (Confidence: {Math.round(item.confidence * 100)}%)
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No immediate emergency objects detected in the image.</p>
            )}
          </div>
        </div>
      </div>
      
      {processingFirstAid && (
        <div className="flex flex-col items-center justify-center p-6">
          <div className="loading-spinner"></div>
          <p className="mt-4">Generating first aid instructions...</p>
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;