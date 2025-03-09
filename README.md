# Emergency Response AI Assistant

An AI-powered emergency response system that provides first aid instructions based on audio descriptions and scene images.

## Features

- **Audio Transcription**: Record emergency descriptions that are transcribed using Whisper
- **Image Analysis**: Capture and analyze emergency scenes using YOLO object detection
- **First Aid Instructions**: Receive AI-generated first aid steps based on the emergency data
- **Location Tracking**: Automatically capture GPS coordinates for emergency services

## Tech Stack

### Frontend
- React with Vite
- Tailwind CSS
- JavaScript
- Web APIs (MediaRecorder, Geolocation, etc.)

### Backend
- FastAPI
- Python
- AI Models:
  - Whisper (Audio transcription)
  - YOLO (Image analysis)
  - OpenAI GPT-4 (First aid response generation)

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd emergency/backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add your OpenAI API key: `OPENAI_API_KEY=your_api_key_here`

5. Run the FastAPI server:
   ```
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd emergency/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm start
   ```

## Usage

1. Open `http://localhost:3000` in your browser
2. Record an audio description of the emergency
3. Take a photo of the emergency scene
4. Review the AI-generated first aid instructions

## Important Note

This application is for demonstration purposes only. In a real emergency, always call your local emergency services.

## Hackathon Project

This project was created as part of [Hackathon Name] to demonstrate the potential of AI technologies in emergency response scenarios.
