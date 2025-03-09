import whisper
import os

# Load Whisper model once during startup
model = None

def load_model():
    global model
    if model is None:
        model = whisper.load_model("base")
    return model

def transcribe_audio(audio_path):
    """
    Transcribe audio file using Whisper
    
    Args:
        audio_path: Path to the audio file
        
    Returns:
        Transcribed text
    """
    whisper_model = load_model()
    result = whisper_model.transcribe(audio_path)
    return result["text"]
