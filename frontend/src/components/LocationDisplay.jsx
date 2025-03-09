import React, { useState, useEffect } from 'react';

const LocationDisplay = ({ location }) => {
  const [address, setAddress] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  
  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      // Set up map URL
      setMapUrl(`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${location.latitude},${location.longitude}&zoom=17`);
      
      // Attempt to get a human-readable address (reverse geocoding)
      // Note: In a real app, you might use a geocoding API or service
      const getAddress = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'Emergency Response App'
              }
            }
          );
          const data = await response.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
          }
        } catch (error) {
          console.error('Error fetching address:', error);
        }
      };
      
      getAddress();
    }
  }, [location]);
  
  if (!location) {
    return null;
  }
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Your Location</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emergency-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">Coordinates:</span>
          <span className="text-gray-700">
            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </span>
        </div>
        
        {address && (
          <div className="flex items-start space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emergency-blue mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium">Address:</span>
            <span className="text-gray-700">{address}</span>
          </div>
        )}
        
        <div className="border-t pt-4">
          <div className="aspect-w-16 aspect-h-9 mt-2">
            {mapUrl ? (
              <iframe
                title="Your location"
                width="100%"
                height="250"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={mapUrl.replace('YOUR_API_KEY', 'DEMO_REPLACE_WITH_YOUR_API_KEY')}
              ></iframe>
            ) : (
              <div className="bg-gray-100 h-64 flex items-center justify-center">
                <p className="text-gray-500">Map preview unavailable</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-4">
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emergency-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDisplay;