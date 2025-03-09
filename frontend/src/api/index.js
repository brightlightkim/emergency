const API_BASE_URL = 'http://localhost:8000';

export const transcribeAudio = async (audioFile) => {
  const formData = new FormData();
  formData.append('file', audioFile);

  const response = await fetch(`${API_BASE_URL}/transcribe-audio/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Audio transcription failed: ${response.statusText}`);
  }

  return await response.json();
};

export const analyzeImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await fetch(`${API_BASE_URL}/analyze-image/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Image analysis failed: ${response.statusText}`);
  }

  return await response.json();
};

export const getFirstAidResponse = async (data) => {
  const response = await fetch(`${API_BASE_URL}/first-aid/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`First aid response failed: ${response.statusText}`);
  }

  return await response.json();
};

export const getUserLocation = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Error getting location: ${error.message}`));
        }
      );
    }
  });
};

export const initiateEmergencyCall = async () => {
  const response = await fetch(`${API_BASE_URL}/emergency-call/`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Emergency call initiation failed: ${response.statusText}`);
  }

  return await response.json();
};

export const checkCallStatus = async (callId) => {
  const response = await fetch(`${API_BASE_URL}/call-status/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ call_id: callId }),
  });

  if (!response.ok) {
    throw new Error(`Call status check failed: ${response.statusText}`);
  }

  return await response.json();
};
