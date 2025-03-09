from __future__ import annotations
import os
import time
from retell import Retell
from retell.types import PhoneCallResponse, CallResponse
import dotenv

# Set up API Key
dotenv.load_dotenv()
API_KEY = os.getenv("RETELL_API_KEY")

# Initialize Retell Client
client = Retell(api_key=API_KEY)

def get_llm_id():
    """Fetches the correct LLM ID for Ted the Bear's conversational AI model."""
    llms = client.llm.list()
    return llms[0].llm_id


# Step 1: Create Ted the Bear AI Agent (Only run this once)
def create_agent():
    llm_id = get_llm_id()

    agent = client.agent.create(
        agent_name="Ted the Bear",
        voice_id="11labs-Andrew",  # Choose a voice from Retell's available options
        response_engine={
            "llm_id": llm_id,
            "type": "retell-llm",
        },
        language="en-US"
    )
    print(f"Created agent.")


def update_agent(agent_id):
    llm_id = get_llm_id()

    agent = client.agent.update(
        agent_id=agent_id,
        ambient_sound="summer-outdoor",
        ambient_sound_volume=1.5,
        voice_temperature=1.1
    )
    print(f"Updated agent.")
    

# Step 2: Obtain a Retell Phone Number
def get_phone_number():
    phone_number = client.phone_number.create()
    print(f"Assigned phone number: {phone_number.phone_number}")
    return phone_number.phone_number

# Step 3: Initiate a Call with Ted the Bear
def make_call(agent_id: str, from_number: str, to_number: str):
    call: PhoneCallResponse = client.call.create_phone_call(
        from_number=from_number,
        to_number=to_number,
        override_agent_id=agent_id
    )
    print(f"Call initiated! Call ID: {call.call_id}")
    return call.call_id

# Step 4: Fetch Call Status
def check_call_status(call_id: str):
    call_status: CallResponse = client.call.retrieve(call_id)
    print(f"Call Status: {call_status.call_status}")
    return call_status

# Step 5: Retrieve Call Transcript & Recording URL
def fetch_call_results(call_id: str):
    call_details = client.call.retrieve(call_id)
    return {
        "transcript": call_details.transcript,
        "recording_url": call_details.recording_url,
        "call_status": call_details.call_status
    }

# Initiate a call and return the call ID
def initiate_emergency_call():
    try:
        agent_id = client.agent.list()[0].agent_id
        retell_number = os.getenv("AGENT_PHONE_NUMBER")
        user_number = os.getenv("DANIEL_PHONE_NUMBER")
        
        
        if not retell_number or not user_number:
            return {"error": "Phone numbers not configured in environment variables"}
            
        call_id = make_call(agent_id, retell_number, user_number)
        return {"call_id": call_id, "status": "initiated"}
    except Exception as e:
        return {"error": str(e)}

# Get current call status and results if available
def get_call_status_and_results(call_id: str):
    try:
        call_status_obj = check_call_status(call_id)
        status = call_status_obj.call_status
        
        if status == "ended":
            results = fetch_call_results(call_id)
            return {
                "call_id": call_id,
                "status": status,
                "transcript": results["transcript"],
                "recording_url": results["recording_url"]
            }
        else:
            return {
                "call_id": call_id,
                "status": status
            }
    except Exception as e:
        return {"error": str(e)}
