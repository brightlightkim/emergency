import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { transcribeAudio, analyzeImage, getUserLocation } from '../api';

const EmergencyForm = ({ setLoading, onEmergencyResponse, onLocationUpdate }) => {
  const [mode, setMode] = useState('initial'); // initial, audio, camera
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [imageData, setImageData] = useState(null);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleStartRecording = async () => {
    setMode('audio');
    chunksRef.current = [];
    setIsRecording(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        processAudio(audioBlob);
      };
      
      mediaRecorderRef.current.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
      setIsRecording(false);
    }
  };
  
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const processAudio = async (blob) => {
    try {
      setLoading(true);
      const audioFile = new File([blob], "recording.wav", { type: 'audio/wav' });
      const result = await transcribeAudio(audioFile);
      setTranscription(result.transcription);
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Failed to process audio. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCaptureImage = async () => {
    setMode('camera');
    try {
      await getUserLocationData();
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };
  
  const takePhoto = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageData(imageSrc);
      
      // Convert base64 to blob
      const base64Response = await fetch(imageSrc);
      const blob = await base64Response.blob();
      
      processImage(blob);
    }
  };
  
  const processImage = async (blob) => {
    try {
      setLoading(true);
      const imageFile = new File([blob], "image.jpg", { type: 'image/jpeg' });
      const result = await analyzeImage(imageFile);
      setImageAnalysis(result.injury_detected);
      
      // If we have both transcription and image analysis, send to parent component
      if (transcription) {
        onEmergencyResponse({
          transcription: transcription,
          imageResult: result.injury_detected
        });
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const getUserLocationData = async () => {
    try {
      const locationData = await getUserLocation();
      onLocationUpdate(locationData);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };
  
  const resetForm = () => {
    setMode('initial');
    setAudioBlob(null);
    setTranscription('');
    setImageData(null);
    setImageAnalysis(null);
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Emergency Situation Report</h2>
      
      {mode === 'initial' && (
        <div className="space-y-6">
          <p className="text-gray-700">
            Please describe your emergency situation. We'll analyze your report and provide first aid instructions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={handleStartRecording} 
              className="flex items-center justify-center bg-emergency-blue text-white py-4 px-6 rounded-lg hover:bg-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Record Audio Description
            </button>
            
            <button 
              onClick={handleCaptureImage}
              className="flex items-center justify-center bg-emergency-green text-white py-4 px-6 rounded-lg hover:bg-green-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Capture Scene Image
            </button>
          </div>
        </div>
      )}
      
      {mode === 'audio' && (
        <div className="space-y-6">
          <div className="text-center">
            {isRecording ? (
              <div className="mb-4">
                <div className="w-24 h-24 rounded-full bg-emergency-red animate-pulse mx-auto flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <p className="text-lg font-medium">Recording... Describe your emergency</p>
              </div>
            ) : (
              <div className="mb-4">
                {transcription ? (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Transcription:</h3>
                    <p>{transcription}</p>
                  </div>
                ) : (
                  <p>Audio processing...</p>
                )}
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              {isRecording ? (
                <button 
                  onClick={handleStopRecording}
                  className="bg-emergency-red text-white px-6 py-2 rounded-lg hover:bg-red-600"
                >
                  Stop Recording
                </button>
              ) : (
                <button 
                  onClick={handleCaptureImage}
                  className="bg-emergency-green text-white px-6 py-2 rounded-lg hover:bg-green-600"
                >
                  Continue to Image Capture
                </button>
              )}
              
              <button 
                onClick={resetForm}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}
      
      {mode === 'camera' && (
        <div className="space-y-6">
          {!imageData ? (
            <div className="relative">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: "environment"
                }}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button 
                  onClick={takePhoto}
                  className="bg-white rounded-full p-3 shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emergency-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2">Captured Image:</h3>
                <img src={imageData} alt="Emergency scene" className="w-full h-64 object-cover rounded-lg" />
              </div>
              
              {imageAnalysis ? (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Image Analysis:</h3>
                  <pre className="text-sm overflow-auto max-h-40">
                    {JSON.stringify(imageAnalysis, null, 2)}
                  </pre>
                </div>
              ) : (
                <p>Analyzing image...</p>
              )}
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={takePhoto}
                  className="bg-emergency-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Take New Photo
                </button>
                
                <button 
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmergencyForm;
