import React, { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import EmergencyForm from "./components/EmergencyForm.jsx";
import ResponseDisplay from "./components/ResponseDisplay.jsx";
import LocationDisplay from "./components/LocationDisplay.jsx";
import RetellCall from "./components/RetellCall.jsx";

function App() {
  const [loading, setLoading] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const [firstAidResponse, setFirstAidResponse] = useState(null);
  const [location, setLocation] = useState(null);
  const [step, setStep] = useState(1);
  const [callCompleted, setCallCompleted] = useState(false);
  const [callTranscript, setCallTranscript] = useState(null);
  const [emergencyNews, setEmergencyNews] = useState(null);
  const [newsLoading, setNewsLoading] = useState(false);

  useEffect(() => {
    fetchEmergencyNews();
  }, []);

  const fetchEmergencyNews = async () => {
    setNewsLoading(true);
    try {
      const response = await fetch(
        "https://api.perplexity.ai/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "sonar",
            messages: [
              {
                role: "system",
                content: "Be precise and concise.",
              },
              {
                role: "user",
                content:
                  "What are the latest emergency alerts or news from Utah area? Provide 3 short recent items with dates.",
              },
            ],
            max_tokens: 250,
            temperature: 0.2,
          }),
        }
      );

      const data = await response.json();
      setEmergencyNews(data.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching emergency news:", error);
      setEmergencyNews("Unable to fetch emergency news at this time.");
    } finally {
      setNewsLoading(false);
    }
  };

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

  const handleCallCompleted = (callData) => {
    setCallCompleted(true);
    setCallTranscript(callData.transcript);
    setStep(4); // Move to the directions step
  };

  const resetApplication = () => {
    setEmergencyData(null);
    setFirstAidResponse(null);
    setCallCompleted(false);
    setCallTranscript(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Emergency Information</h2>
            <div className="prose max-w-none">
              {newsLoading ? (
                <p className="text-gray-500">Loading emergency news...</p>
              ) : emergencyNews ? (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Latest Emergency Alerts - Utah
                  </h3>
                  <p className="whitespace-pre-line">{emergencyNews}</p>
                  <div className="mt-2 text-right">
                    <button
                      onClick={fetchEmergencyNews}
                      className="text-sm text-emergency-blue hover:underline"
                    >
                      Refresh News
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  No emergency information available.
                </p>
              )}
            </div>
          </div>

          {location && <LocationDisplay location={location} />}

          {emergencyNews && (
            <RetellCall
              onCallCompleted={handleCallCompleted}
              setLoading={setLoading}
            />
          )}

          <div className="flex justify-center">
            <button
              onClick={resetApplication}
              className="bg-emergency-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Start New Emergency Report
            </button>
          </div>
        </div>

        {step === 4 && callCompleted && (
          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">
                Emergency Call Completed
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        Your emergency call has been processed. Emergency
                        services have been notified.
                      </p>
                    </div>
                  </div>
                </div>

                {callTranscript && (
                  <div>
                    <h3 className="font-medium mb-2">Call Transcript:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line text-sm">
                        {callTranscript}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Show directions to the safe location */}
            <LocationDisplay location={location} showDirections={true} />

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
          <p className="text-sm mt-2">
            In a real emergency, please call your local emergency number
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
