from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from pydantic import BaseModel
from services.audio_transcription import transcribe_audio
from services.image_analysis import analyze_image
from services.emergency_response import generate_first_aid
from services.retell import initiate_emergency_call, get_call_status_and_results

app = FastAPI(title="Emergency Response API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FirstAidRequest(BaseModel):
    transcription: str
    image_result: dict

class CallStatusRequest(BaseModel):
    call_id: str

@app.get("/")
async def root():
    return {"message": "Emergency Response API is running"}

@app.post("/transcribe-audio/")
async def transcribe_audio_endpoint(file: UploadFile = File(...)):
    try:
        # Save the uploaded file temporarily
        with open("temp_audio.wav", "wb") as buffer:
            buffer.write(await file.read())
        
        # Process the audio file
        text = transcribe_audio("temp_audio.wav")
        
        # Clean up
        os.remove("temp_audio.wav")
        
        return {"transcription": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")

@app.post("/analyze-image/")
async def analyze_image_endpoint(file: UploadFile = File(...)):
    try:
        # Save the uploaded file temporarily
        with open("temp_image.jpg", "wb") as buffer:
            buffer.write(await file.read())
        
        # Process the image
        result = analyze_image("temp_image.jpg")
        
        # Clean up
        os.remove("temp_image.jpg")
        
        return {"injury_detected": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")

@app.post("/first-aid/")
async def first_aid_endpoint(info: FirstAidRequest):
    try:
        response = generate_first_aid(info.transcription, info.image_result)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating first aid response: {str(e)}")

@app.post("/emergency-call/")
async def emergency_call_endpoint():
    try:
        result = initiate_emergency_call()
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error initiating emergency call: {str(e)}")

@app.post("/call-status/")
async def call_status_endpoint(req: CallStatusRequest):
    try:
        result = get_call_status_and_results(req.call_id)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking call status: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
