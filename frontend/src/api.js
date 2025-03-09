import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL
});

export const transcribeAudio = async (audioFile) => {
  let formData = new FormData();
  formData.append("file", audioFile);

  try {
    const response = await api.post("/transcribe-audio/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw error;
  }
};

export const analyzeImage = async (imageFile) => {
  let formData = new FormData();
  formData.append("file", imageFile);

  try {
    const response = await api.post("/analyze-image/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

export const getFirstAidResponse = async (data) => {
  try {
    const response = await api.post("/first-aid/", data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error getting first aid response:", error);
    throw error;
  }
};

export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};
