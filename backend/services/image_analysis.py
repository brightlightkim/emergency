import os
import base64
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Global client instance
client = None

def load_model():
    """Initialize the OpenAI client"""
    global client
    if client is None:
        # Initialize OpenAI client with API key from environment variable
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    return client

def analyze_image(image_path):
    """
    Analyze image to detect injuries or emergency situations using OpenAI Vision
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Dict with detected objects and confidence scores
    """
    # Load the OpenAI client
    client = load_model()
    
    # Read and encode the image
    with open(image_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    try:
        # Call the OpenAI Vision API
        response = client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Analyze this image for emergency situations or injuries. Identify any people, vehicles, fire, blood, injuries, accidents, or other emergency-related objects. Provide a list of detected objects with confidence levels (high, medium, low) and determine if this is an emergency situation."},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=300
        )
        
        # Process the response text to extract structured information
        analysis_text = response.choices[0].message.content
        
        # Parse the response (simplified version, can be enhanced with better parsing)
        detections = []
        emergency_keywords = ['person', 'car', 'truck', 'fire', 'blood', 'injury', 'accident', 'emergency']
        emergency_objects = []
        has_emergency = any(keyword in analysis_text.lower() for keyword in emergency_keywords)
        
        # Extract objects mentioned in the response
        # This is a simple implementation - in a real app, you'd want more robust parsing
        for keyword in emergency_keywords:
            if keyword in analysis_text.lower():
                confidence = "high" if keyword in analysis_text.lower().split()[:20] else "medium"
                item = {"class": keyword, "confidence": confidence}
                detections.append(item)
                emergency_objects.append(item)
        
        return {
            "all_detections": detections,
            "emergency_detections": emergency_objects,
            "has_emergency": has_emergency,
            "analysis": analysis_text
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "all_detections": [],
            "emergency_detections": [],
            "has_emergency": False
        }
