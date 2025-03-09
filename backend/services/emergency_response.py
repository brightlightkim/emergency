from dotenv import load_dotenv
import os
from cerebras.cloud.sdk import Cerebras

load_dotenv()

# Initialize Cerebras client
api_key = os.environ.get("CEREBRAS_API_KEY")
client = Cerebras(api_key=api_key)

def generate_first_aid(transcription, injury_info):
    """
    Generate first aid instructions based on the emergency details
    
    Args:
        transcription: Transcribed audio from the emergency call
        injury_info: Information about detected injuries or emergencies
        
    Returns:
        First aid instructions text
    """
    # Create a structured prompt with the emergency information
    prompt = f"""
    EMERGENCY SITUATION ASSESSMENT:
    
    User's Emergency Call: "{transcription}"
    
    Scene Analysis: {injury_info}
    
    Based on the emergency information above:
    1. Identify the most critical injuries or emergency conditions
    2. Provide clear, step-by-step first aid instructions
    3. Include immediate actions to take while waiting for professional help
    4. Mention any critical warnings or precautions
    
    Format your response as clear instructions that could be read to someone at the scene.
    """
    
    try:
        # Call the Cerebras API
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an emergency medical response assistant. Provide concise, accurate first aid instructions based on the emergency description."},
                {"role": "user", "content": prompt}
            ],
            model="llama3.1-8b",  # Using the Llama 3.1 8B model
            temperature=0.3,      # Lower temperature for more focused responses
            max_tokens=500        # Limit response length
        )
        
        # Extract the response text
        return response.choices[0].message.content
    except Exception as e:
        # Fallback response in case of API error
        print(f"Error calling Cerebras API: {str(e)}")
        return "Unable to generate first aid instructions. Please call emergency services immediately at 911."
