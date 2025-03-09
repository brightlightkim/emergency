from ultralytics import YOLO
import torch
import cv2
import numpy as np

# Global model instance
model = None

def load_model():
    global model
    if model is None:
        model = YOLO("yolov8n.pt")  # Load pretrained model
    return model

def analyze_image(image_path):
    """
    Analyze image to detect injuries or emergency situations
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Dict with detected objects and confidence scores
    """
    # Load the model
    detection_model = load_model()
    
    # Perform inference
    results = detection_model(image_path)
    
    # Process results
    detections = []
    for result in results:
        for box in result.boxes:
            obj_class = result.names[int(box.cls[0])]
            confidence = float(box.conf[0])
            # Only return high-confidence detections
            if confidence > 0.5:
                detections.append({
                    "class": obj_class,
                    "confidence": confidence
                })
    
    # Additional logic for injury detection based on objects
    # This is a simplified example - you would expand this for real injury detection
    emergency_keywords = ['person', 'car', 'truck', 'fire', 'blood']
    emergency_objects = [item for item in detections if item['class'] in emergency_keywords]
    
    return {
        "all_detections": detections,
        "emergency_detections": emergency_objects,
        "has_emergency": len(emergency_objects) > 0
    }
