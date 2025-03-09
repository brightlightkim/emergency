import React, { useState } from 'react';
import Header from './components/Header.jsx';
import EmergencyForm from './components/EmergencyForm.jsx';
import ResponseDisplay from './components/ResponseDisplay.jsx';
import LocationDisplay from './components/LocationDisplay.jsx';

function App() {
  const [loading, setLoading] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const [firstAidResponse, setFirstAidResponse] = useState(null);
  const [location, setLocation] = useState(null);
  const [step, setStep] = useState(1);

  const handleEmergencyResponse = (data) => {
    setEmergencyData(data);
    setStep(2);
  };

  const handleFirstAidResponse = (response) => {
    setFirstAidResponse(response);
    setStep(3);
  };

  const handleLocationUpdate = (locationData) => {
    setLocation(locationData);
  };

  const resetApplication = () => {
    setEmergencyData(null);
    setFirstAidResponse(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="loading-spinner mx-auto"></div>
              <p className="mt-4 text-center">Processing your emergency request...</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <EmergencyForm 
            setLoading={setLoading} 
            onEmergencyResponse={handleEmergencyResponse}
            onLocationUpdate={handleLocationUpdate}
          />
        )}
        
        {step === 2 && emergencyData && (
          <ResponseDisplay 
            emergencyData={emergencyData}
            setLoading={setLoading}
            onFirstAidResponse={handleFirstAidResponse}
          />
        )}
        
        {step === 3 && firstAidResponse && (
          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">First Aid Instructions</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{firstAidResponse.response}</p>
              </div>
            </div>
            
            {location && <LocationDisplay location={location} />}
            
            <div className="flex justify-center">
              <button 
                onClick={resetApplication}
                className="bg-emergency-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Start New Emergency Report
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-emergency-dark text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>Emergency Response System - For demonstration purposes only</p>
          <p className="text-sm mt-2">In a real emergency, please call your local emergency number</p>
        </div>
      </footer>
    </div>
  );
}

export default App;