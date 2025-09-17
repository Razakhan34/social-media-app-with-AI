import cv2
import cloudinary
import cloudinary.uploader
import os
import json
from bson import ObjectId
from datetime import datetime, timezone
from bson import json_util
import numpy as np
from flask import jsonify

# from flask_socketio import SocketIO
# import cv2
# import os
# import json
# from bson import ObjectId, json_util
# from pymongo import MongoClient
from deepface import DeepFace
from ultralytics import YOLO
# import numpy as np
import cloudinary.uploader


# Custom JSON Encoder class to handle datetime serialization
class CustomJSONEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, ObjectId):
        return str(obj)
    else:
        return super().default(obj)
      
def upload_to_cloudinary(image_path):
    try:
        # Upload image to Cloudinary
        upload_result = cloudinary.uploader.upload(image_path, folder="social/chat/emotion")
        
        # Extract public ID and URL from upload result
        public_id = upload_result['public_id']
        url = upload_result['secure_url']
        
        return {
            'public_id': public_id,
            'url': url
        }
    except Exception as e:
        print("Error uploading image to Cloudinary:", e)
        return None
      
# def detect_user_image():
#     camera = cv2.VideoCapture(0)
#     _, frame = camera.read()
#     # Save image locally
#     cv2.imwrite('temp_image.jpg', frame)

#     # Upload image to Cloudinary
#     cloudinary_response = upload_to_cloudinary('temp_image.jpg')
    
#     return cloudinary_response

# Load YOLOv8 model for person detection
yolo_model = YOLO('yolov8n.pt')  # Pretrained YOLOv8 nano model

# Function to detect clothing status using YOLO and skin detection heuristic
def detect_clothing(img_path):
    try:
        # Read image
        img = cv2.imread(img_path)
        if img is None:
            raise Exception("Failed to load image.")

        # Run YOLO inference to detect person
        results = yolo_model(img)
        person_detected = False
        torso_region = None

        # Process YOLO results
        for result in results:
            boxes = result.boxes
            for box in boxes:
                if int(box.cls) == 0:  # Class 0 is 'person' in YOLO
                    person_detected = True
                    # Get bounding box coordinates
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    # Estimate torso region (middle 50% of bounding box height)
                    torso_y1 = y1 + int((y2 - y1) * 0.25)
                    torso_y2 = y1 + int((y2 - y1) * 0.75)
                    torso_region = img[torso_y1:torso_y2, x1:x2]
                    break

        if not person_detected:
            return False, "No person detected in the image."

        if torso_region is None or torso_region.size == 0:
            return False, "Failed to extract torso region."

        # Heuristic: Detect skin exposure in torso (simplified nudity check)
        hsv_torso = cv2.cvtColor(torso_region, cv2.COLOR_BGR2HSV)
        lower_skin = np.array([0, 20, 70], dtype=np.uint8)
        upper_skin = np.array([20, 255, 255], dtype=np.uint8)
        skin_mask = cv2.inRange(hsv_torso, lower_skin, upper_skin)

        # Calculate skin pixel ratio
        skin_pixels = cv2.countNonZero(skin_mask)
        total_pixels = skin_mask.size
        skin_ratio = skin_pixels / total_pixels

        # Threshold: If >50% of torso is skin, assume "not clothed"
        if skin_ratio > 0.5:
            return False, "Privacy alert: Person appears not to be wearing clothes."
        else:
            print("Person appears to be clothed.")
            return True, "Person appears to be clothed."

    except Exception as e:
        return False, f"Error in clothing detection: {str(e)}"

# Function to detect gender using DeepFace
def detect_gender(img_path):
    try:
        # Analyze image for gender
        result = DeepFace.analyze(img_path, actions=['gender'], enforce_detection=True)
        dominant_gender = result[0]['dominant_gender']
        print(dominant_gender)
        print("Image path",img_path)
        return dominant_gender, None
    except Exception as e:
        return None, f"Error in gender detection: {str(e)}"

def detect_user_image():
    temp_image_path = "temp_image.jpg"
    try:
        # Capture image from camera
        camera = cv2.VideoCapture(0)
        ret, frame = camera.read()
        
        cv2.imwrite(temp_image_path, frame)
        
        if not os.path.exists(temp_image_path):
            return False, "Failed to save image."

        # Step 1: Check gender
        dominant_gender, gender_error = detect_gender(temp_image_path)
        if gender_error:
            os.remove(temp_image_path)
            return False, gender_error
        
        if dominant_gender.lower() == 'woman':
            os.remove(temp_image_path)
            return False, "Privacy alert: Image capture not allowed for female users."

        # Step 2: Check clothing status
        is_clothed, clothing_message = detect_clothing(temp_image_path)
        if not is_clothed:
            os.remove(temp_image_path)
            return False, clothing_message

        # Step 3: Upload image to Cloudinary
        cloudinary_response = cloudinary.uploader.upload(temp_image_path)
        return True, cloudinary_response

    except Exception as e:
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)
        return False, f"Error in detect_user_image: {str(e)}"